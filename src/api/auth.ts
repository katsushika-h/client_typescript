import {hash, verify} from "argon2";

export async function hashPassword(password: string): Promise<string> {
    const argon = require("argon2");
    try {
        const hashedPassword = await hash(password);  
        return hashedPassword;
    } catch (err) {
        console.error("Error hashing password:", err);
        throw new Error("Failed to hash password");
    }
}

export async function checkPassword(password: string, hashedPassword: string): Promise<boolean> {
    const argon2 = require("argon2");
    try {
        if(await verify(hashedPassword, password)) {
            return true;
        } else {
            return false;
        } 
    }
    catch (err) {
            console.error("Error verifying password:", err);
            throw new Error("Failed to verify password");
        }       

    };