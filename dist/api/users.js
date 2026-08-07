import { createUser } from "../db/queries/users.js";
import * as js from "./jsonhelper.js";
export async function addUserByEmail(req, res) {
    console.log("Received new user request:", req.body);
    //error handling for missing email in request body
    if (!req.body || !req.body.email) {
        js.responseError(res, 400, "Missing email in request body");
        return;
    }
    const userEmail = req.body;
    const createdUser = await createUser({ email: userEmail.email });
    if (!createdUser) {
        js.responseError(res, 400, "User already exists");
        return;
    }
    console.log("Created user:", createdUser);
    js.responseJSON(res, 201, createdUser);
}
