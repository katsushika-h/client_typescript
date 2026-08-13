import { generateJWT, validateJWT, hashPassword, checkPassword, getBearerToken, makeRefreshToken } from "../auth.js";
import { describe, it, expect, beforeAll } from "vitest";
import { Request, Response} from "express";
import { createUser } from "../db/queries/users.js";

beforeAll(
    async () => {
        createUser({
            email: "katsushika.hokusai@gmail.com",
            hashedPassword: await hashPassword("password")
        })
    }
)

describe("Testing token refreshing", () => {
    it("Generates a token", ()=>{
        console.log("testing token generation")
        const token =  makeRefreshToken()
        expect(token).toBeTypeOf('string')
    })
});