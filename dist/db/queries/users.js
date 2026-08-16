import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from "drizzle-orm";
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function deleteDb() {
    await db.delete(users);
}
;
export async function lookupUser(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
}
export async function lookupUserById(id) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
}
export async function updateUser(id, email, password) {
    const [user] = await db
        .update(users)
        .set({ email: email,
        hashedPassword: password,
        updatedAt: new Date()
    })
        .where(eq(users.id, id))
        .returning();
    return user;
}
export async function upgradeUserByID(id) {
    const [user] = await db
        .update(users)
        .set({ isChirpyRed: true })
        .where(eq(users.id, id))
        .returning();
    return user;
}
