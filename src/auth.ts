import {hash, verify} from "argon2";
import * as error from "./api/errorClasses.js"; 
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"; 
import { Request, Response } from "express";
import { randomBytes } from "node:crypto";


type payload = Pick<JwtPayload, 'iss' | 'sub' | 'iat' | 'exp'>;


export async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await hash(password);
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password");
    }
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    try {
        return await verify(hashedPassword, password);
    } catch (err) {
        console.error("Error verifying password:", err);
        throw new error.UnauthorizedError("Failed to verify password");
    }
}

export function generateJWT(userID: string, expiresIn: number, secret: string): string{
    const payload: payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    };
    return jwt.sign(payload, secret, { algorithm: "HS256" });
}

export function validateJWT(tokenString: string, secret: string): string{
    try {
        const decoded = jwt.verify(tokenString, secret) as payload;
        if (!decoded.sub){
            throw new error.BadRequestError("malformed payload")
        }
        return decoded.sub;
        
    } catch (err) {
        console.error("Error validating JWT:", err);
        throw new error.UnauthorizedError("Invalid or expired token");
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.get("Authorization");

    if (!authHeader) {
        throw new error.UnauthorizedError("Missing Authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new error.UnauthorizedError("Malformed Authorization header");
    }

    return token;
}

export function makeRefreshToken():string {
    const token = randomBytes(32).toString("hex")
    return token
}

export function getAPIKey(req: Request): string{

    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new error.UnauthorizedError("Missing Authorization header");
    }

    const [scheme, apiKey] = authHeader.split(" ");

    if (scheme !== "ApiKey" || !apiKey) {
        throw new error.UnauthorizedError("Missing API Key");
    }

    return apiKey;

}