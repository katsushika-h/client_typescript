import { 
    addRefreshToken, 
    getRefreshToken, 
    getUserFromRefreshToken,
    deleteToken
} from "../db/queries/refresh_tokens.js";
import { Request, Response } from "express";
import * as error from "./errorClasses.js"
import { generateJWT, getBearerToken } from "../auth.js";
import { config } from "../config.js";
import * as js from "./jsonhelper.js"

export async function refreshAccessToken (req: Request, res: Response){
    const getToken = getBearerToken(req)
    console.log("getting user id from bearer token " + getToken )
    const userId = await getUserFromRefreshToken(getToken)
    console.log("Gotten userid " + userId)
    if (userId === undefined){throw new error.UnauthorizedError("Invalid token")}
    
    console.log("Refreshing token for user " + userId)

    const jwtToken = generateJWT(userId.user_id, 3600, config.api.secret )

    js.responseJSON(res, 200, {token: jwtToken})
}

export async function revokeRefreshToken(req: Request, res: Response){
    const refreshToken = getBearerToken(req)
    await deleteToken(refreshToken)
    res.sendStatus(204) ;
};
