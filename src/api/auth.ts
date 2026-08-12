import { Request, Response } from "express";
import * as js from "./jsonhelper.js";
import { lookupUser } from "../db/queries/users.js";
import { checkPassword, validateJWT } from "../auth.js";
import {publicUser} from "./users.js"

export type loginRequest = {
    email: string;
    password: string;
    expiresInSeconds?: number;
}

export async function loginUser(req: Request, res: Response): Promise<void> {
    console.log("Received login request:", req.body);
    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    } else if (!req.body || !req.body.password) {
        js.responseError(res, 400, "Missing password in request body");
        return;
    }

    const {email, password, expiresInSeconds = 3600}: loginRequest = req.body;
    const effectiveExpiration = Math.min(expiresInSeconds, 3600)

    const user = await lookupUser(email);
    if (!user) {
        js.responseError(res, 400, "User doesn't exist");
        return;
    }

    const isMatch = await checkPassword(password, user.hashedPassword);

    if (!isMatch) {
        js.responseError(res, 401, "Invalid email or password");
        return;
    }

    console.log("User logged in:", user.email);

    js.responseJSON(res, 200, publicUser(user));
};