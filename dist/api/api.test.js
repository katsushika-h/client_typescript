import { makeRefreshToken } from "../auth.js";
import { describe, it, expect } from "vitest";
describe("Testing token refreshing", () => {
    it("Generates a token", () => {
        console.log("testing token generation");
        const token = makeRefreshToken();
        expect(token).toBeTypeOf('string');
    });
});
