import { createUser, lookupUser } from "../db/queries/users.js";
import * as js from "./jsonhelper.js";
import { hashPassword, checkPassword } from "./auth.js";
// removes password from user object 
function publicUser(user) {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
}
// adds a new user to the database and returns the created user without the password
export async function addUserByEmail(req, res) {
    console.log("Received new user request:", req.body);
    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    }
    else if (!req.body || !req.body.password) {
        js.responseError(res, 400, "Missing password in request body");
        return;
    }
    const userCred = {
        email: req.body.email,
        password: await hashPassword(req.body.password)
    };
    const createdUser = await createUser({ email: userCred.email, hashedPassword: userCred.password });
    if (!createdUser) {
        js.responseError(res, 400, "User already exists");
        return;
    }
    const cleanedUser = publicUser(createdUser);
    console.log("Created user:", createdUser.email);
    js.responseJSON(res, 201, cleanedUser);
}
// checks if the user exists and if the password matches, then returns the user without the password
export async function loginUser(req, res) {
    console.log("Received login request:", req.body);
    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    }
    else if (!req.body || !req.body.password) {
        js.responseError(res, 400, "Missing password in request body");
        return;
    }
    const userCred = {
        email: req.body.email,
        password: req.body.password
    };
    const user = await lookupUser(userCred.email);
    if (!user) {
        js.responseError(res, 400, "User doesn't exist");
        return;
    }
    const isMatch = await checkPassword(userCred.password, user.hashedPassword);
    if (!isMatch) {
        js.responseError(res, 401, "Invalid email or password");
        return;
    }
    console.log("User logged in:", user.email);
    js.responseJSON(res, 200, publicUser(user));
}
