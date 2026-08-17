import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { asc, desc, eq } from "drizzle-orm";


export async function addChirp(chirp: NewChirp){
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

export async function getChirpByUserId(userId: string){
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId))
        .orderBy(asc(chirps.createdAt))
    return result
}

export async function dbGetChirpById(chirpId: string) {
    const result = await db.select().from(chirps).where(eq(chirps.id, chirpId));
    return result[0];
}   

export async function deleteChirpById(chirpID:string) {
    const chirp = await db
        .delete(chirps)
        .where(
            eq(chirps.id, chirpID)
        ).returning()
    return chirp
}
    

