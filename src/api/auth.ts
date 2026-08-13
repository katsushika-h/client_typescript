import { Request, Response } from "express";
import * as js from "./jsonhelper.js";
import { lookupUser } from "../db/queries/users.js";
import { addRefreshToken } from "../db/queries/refresh_tokens.js";
import { checkPassword, validateJWT, generateJWT, makeRefreshToken } from "../auth.js";
import { config } from "../config.js"


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


    const jwtToken = generateJWT(user.id, Math.min(expiresInSeconds, 3600), config.api.secret )
    const expiryDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)
    const refreshToken = await addRefreshToken({
        token : makeRefreshToken(),
        user_id : user.id,
        expiresAt: expiryDate
    });

    console.log("Refresh token created: " + refreshToken)
    console.log("User logged in:", user.email);

    js.responseJSON(res, 200, {
        "id": user.id,
        "createdAt": user.createdAt,
        "updatedAt": user.updatedAt,
        "email": user.email,
        "token": jwtToken,
        "refreshToken": refreshToken.token
    })
 };