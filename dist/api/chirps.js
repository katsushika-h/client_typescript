import * as js from "./jsonhelper.js";
import { BadRequestError, NotFoundError } from "./errorClasses.js";
import { addChirp, allChirps, dbGetChirpById } from "../db/queries/chirps.js";
export async function createChirp(req, res) {
    const maxChirpLength = 140;
    //Filtered Words
    const re = /\b(kerfuffle|sharbert|fornax)\b/gi;
    console.log("Received chirp body:", req.body);
    let chirpBody = (req.body);
    if (chirpBody.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    // Filter the request body for the specified words
    const filtered = chirpBody.body.replace(re, "****");
    // js.responseJSON(res, 200, { "cleanedBody" : filtered });
    const createdChirp = await addChirp({ body: filtered, userId: chirpBody.userId });
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
        throw new BadRequestError("Missing chirpId parameter");
    }
    const chirps = await dbGetChirpById(chirpId);
    if (!chirps) {
        throw new NotFoundError(`No chirp found with id: ${chirpId}`);
    }
    js.responseJSON(res, 200, chirps);
}
