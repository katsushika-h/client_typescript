import { 
    addRefreshToken, 
    getRefreshToken, 
    getUserFromRefreshToken 
} from "../db/queries/refresh_tokens.js";
import { Request, Response } from "express";
import * as error from "./errorClasses.js"
import { generateJWT } from "../auth.js";
import { config } from "../config.js";

export async function refreshAccessToken (req: Request){
    const authHeader = req.get("Authorization");
    if (!authHeader) {
        throw new error.UnauthorizedError("Missing Authorization header");
    }

    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
        throw new error.UnauthorizedError("Malformed Authorization header");
    }
    const userId = await getUserFromRefreshToken(token)
    if (!userId){throw new error.UnauthorizedError("Invalid token")}

    console.log("Refreshing token for user " + userId)

    const jwtToken = generateJWT(userId, 3600, config.api.secret )

    return jwtToken
}