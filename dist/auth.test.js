import { generateJWT, validateJWT, hashPassword, checkPassword, getBearerToken } from "./auth.js";
import { describe, it, expect, beforeAll } from "vitest";
describe("Auth Functions", () => {
    const secret = "your-secret-key";
    const secret2 = "another-secret-key";
    const userID = "test-user-id";
    const expiresIn = 3600; // 1 hour
    let token;
    beforeAll(() => {
        token = generateJWT(userID, expiresIn, secret);
    });
    it("should generate a valid JWT", () => {
        console.log("Generated JWT:", token);
        expect(token).toBeTypeOf("string");
    });
    it("should validate a valid JWT", () => {
        const validatedUserID = validateJWT(token, secret);
        expect(validatedUserID).toBe(userID);
    });
    it("should not return a valid userID for an invalid JWT", () => {
        const invalidToken = token + "invalid";
        expect(() => validateJWT(invalidToken, secret)).toThrowError();
    });
    it("should not return a valid userID for a JWT with the wrong secret", () => {
        expect(() => validateJWT(token, secret2)).toThrowError();
    });
    it("should not return a valid userId for an expired JWT", () => {
        const expiredToken = generateJWT(userID, -1, secret); // Token that expires immediately
        expect(() => validateJWT(expiredToken, secret)).toThrowError();
    });
    it("should throw when Authorization header is missing", () => {
        const req = {
            get: (header) => {
                "";
            }
        };
        expect(() => getBearerToken(req)).toThrowError("Missing Authorization header");
    });
    it("should throw when Authorization header is malformed", () => {
        const req = {
            get: (header) => "malformed_header"
        };
        expect(() => getBearerToken(req)).toThrowError("Malformed Authorization header");
    });
    it("should return the bearer token from a valid Authorization header", () => {
        const req = {
            get: (header) => "Bearer myToken123"
        };
        expect(getBearerToken(req)).toBe("myToken123");
    });
});
//password hashing and verification tests
describe("password hashing", () => {
    const password = "test-password";
    const password2 = "test-password2";
    let hash1;
    let hash2;
    beforeAll(async () => {
        hash1 = await hashPassword(password);
        hash2 = await hashPassword(password2);
    });
    it("should hash a password", async () => {
        expect(hash1).toBeTypeOf("string");
        expect(hash2).toBeTypeOf("string");
        expect(hash1).not.toBe(password);
        expect(hash2).not.toBe(password2);
    });
    it("should verify a password against its hash", async () => {
        const isValid1 = await checkPassword(password, hash1);
        expect(isValid1).toBe(true);
    });
    it("should not verify a password against a different hash", async () => {
        const isValid2 = await checkPassword(password, hash2);
        expect(isValid2).toBe(false);
    });
});
