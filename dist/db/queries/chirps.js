import { db } from "../index.js";
import { chirps } from "../schema.js";
import { asc, eq } from "drizzle-orm";
export async function addChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .returning();
    return result;
}
export async function allChirps() {
    const result = await db.select().from(chirps).orderBy(asc(chirps.createdAt));
    return result;
}
export async function dbGetChirpById(chirpId) {
    const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result[0];
}
export async function deleteChirpById(chirpID) {
    const chirp = await db
        .delete(chirps)
        .where(eq(chirps.id, chirpID)).returning();
    return chirp;
}
