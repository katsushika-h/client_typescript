import { createUser, updateUser, lookupUserById, upgradeUserByID } from "../db/queries/users.js";
import * as js from "./jsonhelper.js";
import * as error from "./errorClasses.js";
import { hashPassword, getBearerToken, validateJWT } from "../auth.js";
import { config } from "../config.js";
// removes password from user object 
export function publicUser(user) {
    return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isChirpyRed: user.isChirpyRed
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
export async function updateDetails(req, res) {
    const { email, password, expiresInSeconds = 3600 } = req.body;
    const accessToken = getBearerToken(req);
    const userToUpdate = validateJWT(accessToken, config.api.secret);
    console.log("Authenticated for user: " + userToUpdate);
    const user = await lookupUserById(userToUpdate);
    if (!user) {
        js.responseError(res, 400, "User doesn't exist");
        return;
    }
    console.log("User found: " + user.email + ". Making updates to user.");
    const hashedPassword = await hashPassword(password);
    const updatedUser = await updateUser(userToUpdate, email, hashedPassword);
    console.log("Updated user: " + updatedUser);
    js.responseJSON(res, 200, publicUser(updatedUser));
}
export async function upgradeUser(req, res) {
    console.log("/api/polka/webhooks accessed");
    if (req.body.event !== "user.upgraded") {
        res.status(204).send();
        return;
    }
    const upgradingUser = req.body.data.userId;
    const upgradedUser = await upgradeUserByID(upgradingUser);
    if (upgradedUser === undefined) {
        throw new error.NotFoundError("User not found");
    }
    ;
    res.status(204).send();
}
