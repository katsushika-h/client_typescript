import { db } from "../index.js";
import { refresh_tokens, newRefreshToken } from "../schema.js";
import {eq} from "drizzle-orm"

export async function addRefreshToken(token: newRefreshToken){
    const [result] = await db
        .insert(refresh_tokens)
        .values(token)
        .returning()
    return result;
}

export async function getRefreshToken(token: string){
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token))
    return result;
}

export async function getUserFromRefreshToken(token: string): Promise<string>{
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens, token))
    const userID = result.user_id
    return userID
}