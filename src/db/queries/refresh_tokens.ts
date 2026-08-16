import { error } from "node:console";
import { db } from "../index.js";
import { refresh_tokens, newRefreshToken } from "../schema.js";
import {eq,and, isNotNull, NotNull, isNull, gt} from "drizzle-orm"

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

export async function getUserFromRefreshToken(token: string){
    const [result] = await db.select().from(refresh_tokens).where(
        and(
            eq(refresh_tokens.token, token),
            isNull(refresh_tokens.revokedAt),
            gt(refresh_tokens.expiresAt, new Date())
        ))
    return result
}

export async function deleteToken(token: string): Promise<void>{
    const result = await db
        .update(refresh_tokens)
        .set({revokedAt: new Date()})
        .where(eq(refresh_tokens.token, token))
        .returning()
    return;
}