import * as js from "./jsonhelper.js";
import { config } from "../config.js";
import { deleteDb } from "../db/queries/users.js";
export async function resetAll(req, res) {
    // Implementation for resetting all users
    if (config.api.platform !== "dev") {
        js.responseError(res, 403, "403 Forbidden: Resetting users is only allowed in development environment");
        return;
    }
    config.api.fileserverHits = 0;
    console.log("Traffic Metrics reset");
    await deleteDb();
    js.responseJSON(res, 200, { message: "All users have been reset" });
}
