import { hash, verify } from "argon2";
import * as error from "./errorClasses.js";
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
