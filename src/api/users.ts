import {createUser, lookupUser} from "../db/queries/users.js";
import { Request, Response } from "express";
import * as js from "./jsonhelper.js";
import { hashPassword , checkPassword } from "./auth.js";

export async function addUserByEmail(req: Request, res: Response): Promise<void> {
    type jsonBody = {
        email: string;
        password: string;
    };
    console.log("Received new user request:", req.body);

    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    } else if (!req.body || !req.body.password) {
        js.responseError(res, 400, "Missing password in request body");
        return;
    }
    
    const userCred: jsonBody = {
        email: req.body.email,
        password: await hashPassword(req.body.password)
    };

    const createdUser = await createUser({email: userCred.email, hashedPassword: userCred.password});
    if (!createdUser) {
        js.responseError(res, 400, "User already exists");
        return;
    }
    console.log("Created user:", createdUser.email);
    js.responseJSON(res, 201, {email: createdUser.email});

}

export async function loginUser(req: Request, res: Response): Promise<void> {
    type jsonBody = {
        password: string;
        email: string;
    };
    type sanitizedUser = Omit<jsonBody, "hashed_password">;

    console.log("Received login request:", req.body);
    
    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    } else if (!req.body || !req.body.password) {
        js.responseError(res, 400, "Missing password in request body");
        return;
    }

    const userCred: jsonBody = {
        email: req.body.email,
        password: req.body.password
    };

    const user = await lookupUser(userCred.email);
    if (!user) {
        js.responseError(res, 400, "User doesn't exist");
        return;
    }

    const isMatch = await checkPassword(userCred.password, user.hashedPassword);
    if (!isMatch) {
        js.responseError(res, 400, "Invalid email or password");
        return;
    }
    console.log("User logged in:", user.email);
    const cleanedUser:sanitizedUser = {
        id: user.id, //change user to not jsonbody
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt

    };
 
    js.responseJSON(res, 200, cleanedUser);
}