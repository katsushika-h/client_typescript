import { responseError } from "./jsonhelper.js";
export async function errorHandler(err, req, res, next) {
    responseError(res, 500, "Something went wrong on our end");
    console.error("Error has occured:", err);
}
;
