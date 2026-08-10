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
