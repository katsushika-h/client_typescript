import {hash, verify} from "argon2";
import * as error from "./api/errorClasses.js"; 
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken"; 

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

export function validateJWT(tokenString: string, secret: string)  {
    try {
        const decoded = jwt.verify(tokenString, secret) as payload;
        return decoded.sub;
        
    } catch (err) {
        console.error("Error validating JWT:", err);
        throw new error.UnauthorizedError("Invalid or expired token");
    }
}

export function getBearerToken(req: Request): string {
    const authHeader = req.headers.get("Authorization");

    if (!authHeader) {
        throw new error.UnauthorizedError("Missing Authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new error.UnauthorizedError("Malformed Authorization header");
    }

    return token;
}