import { db } from "../index.js";
import { refresh_tokens } from "../schema.js";
import { eq, and, isNull, gt } from "drizzle-orm";
export async function addRefreshToken(token) {
    const [result] = await db
        .insert(refresh_tokens)
        .values(token)
        .returning();
    return result;
}
export async function getRefreshToken(token) {
    const [result] = await db.select().from(refresh_tokens).where(eq(refresh_tokens.token, token));
    return result;
}
export async function getUserFromRefreshToken(token) {
    const [result] = await db.select().from(refresh_tokens).where(and(eq(refresh_tokens.token, token), isNull(refresh_tokens.revokedAt), gt(refresh_tokens.expiresAt, new Date())));
    return result;
}
export async function deleteToken(token) {
    const result = await db
        .update(refresh_tokens)
        .set({ revokedAt: new Date() })
        .where(eq(refresh_tokens.token, token))
        .returning();
    return;
}
