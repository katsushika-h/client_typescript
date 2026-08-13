import { hash, verify } from "argon2";
import * as error from "./api/errorClasses.js";
import jwt from "jsonwebtoken";
import { randomBytes } from "node:crypto";
export async function hashPassword(password) {
    try {
        const hashedPassword = await hash(password);
        return hashedPassword;
    }
    catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password");
    }
}
export async function checkPassword(password, hashedPassword) {
    try {
        return await verify(hashedPassword, password);
    }
    catch (err) {
        console.error("Error verifying password:", err);
        throw new error.UnauthorizedError("Failed to verify password");
    }
}
export function generateJWT(userID, expiresIn, secret) {
    const payload = {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + expiresIn
    };
    return jwt.sign(payload, secret, { algorithm: "HS256" });
}
export function validateJWT(tokenString, secret) {
    try {
        const decoded = jwt.verify(tokenString, secret);
        if (!decoded.sub) {
            throw new error.BadRequestError("malformed payload");
        }
        return decoded.sub;
    }
    catch (err) {
        console.error("Error validating JWT:", err);
        throw new error.UnauthorizedError("Invalid or expired token");
    }
}
export function getBearerToken(req) {
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
export function makeRefreshToken() {
    const token = randomBytes(32).toString("hex");
    return token;
}
