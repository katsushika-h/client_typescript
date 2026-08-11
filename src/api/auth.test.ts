import { generateJWT, validateJWT} from "./auth.js";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

describe("Auth Functions", () => {
    const secret = "your-secret-key";
    const userID = "test-user-id";
    const expiresIn = 3600; // 1 hour

    let token: string;

    beforeAll(() => {
        token = generateJWT(userID, expiresIn, secret);
    });

    it("should generate a valid JWT", () => {
        expect(token).toBeTypeOf("string");
    });

    it("should validate a valid JWT", () => {
        const validatedUserID = validateJWT(token, secret);
        expect(validatedUserID).toBe(userID);
    });
});
