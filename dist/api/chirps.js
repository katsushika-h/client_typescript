import * as js from "./jsonhelper.js";
import * as err from "./errorClasses.js";
import { addChirp, allChirps, dbGetChirpById } from "../db/queries/chirps.js";
import { config } from "../config.js";
import { getBearerToken, validateJWT } from "../auth.js";
export async function createChirp(req, res) {
    const maxChirpLength = 140;
    //Filtered Words
    const re = /\b(kerfuffle|sharbert|fornax)\b/gi;
    console.log("Received chirp body:", req.body);
    let chirpBody = (req.body);
    const jwtToken = getBearerToken(req);
    let decodedSub = validateJWT(jwtToken, config.api.secret);
    console.log("Decoded token = " + decodedSub);
    console.log("Chirp body userid = " + chirpBody.userId);
    if (chirpBody.body.length > maxChirpLength) {
        throw new err.BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    // Filter the request body for the specified words
    const filtered = chirpBody.body.replace(re, "****");
    // js.responseJSON(res, 200, { "cleanedBody" : filtered });
    const createdChirp = await addChirp({ body: filtered, userId: decodedSub });
    js.responseJSON(res, 201, createdChirp);
}
;
export async function getChirps(req, res) {
    // Fetches chirp from server in ascending order.
    const chirps = await allChirps();
    js.responseJSON(res, 200, chirps);
}
export async function getChirpById(req, res) {
    const chirpId = req.params.chirpId;
    if (!chirpId) {
        throw new err.BadRequestError("Missing chirpId parameter");
    }
    const chirps = await dbGetChirpById(chirpId);
    if (!chirps) {
        throw new err.NotFoundError(`No chirp found with id: ${chirpId}`);
    }
    js.responseJSON(res, 200, chirps);
}
