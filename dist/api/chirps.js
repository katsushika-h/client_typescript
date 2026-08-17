import * as js from "./jsonhelper.js";
import * as error from "./errorClasses.js";
import { addChirp, allChirps, dbGetChirpById, deleteChirpById, getChirpByUserId } from "../db/queries/chirps.js";
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
        throw new error.BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    // Filter the request body for the specified words
    const filtered = chirpBody.body.replace(re, "****");
    const createdChirp = await addChirp({ body: filtered, userId: decodedSub });
    js.responseJSON(res, 201, createdChirp);
}
;
export async function getChirps(req, res) {
    const authorId = req.query.authorId;
    const sort = req.query.sort === "desc" ? "desc" : "asc";
    // Fetches chirp from server in ascending order if query is not provided.
    const chirps = authorId ? await getChirpByUserId(authorId) : await allChirps();
    if (!chirps) {
        throw new error.NotFoundError("AuthorID not found");
    }
    // sorting
    const sorted = chirps.sort((a, b) => sort === "asc"
        ? a.createdAt.getTime() - b.createdAt.getTime()
        : b.createdAt.getTime() - a.createdAt.getTime());
    js.responseJSON(res, 200, sorted);
}
export async function getChirpById(req, res) {
    const chirpId = req.params.chirpId;
    if (!chirpId) {
        throw new error.BadRequestError("Missing chirpId parameter");
    }
    const chirps = await dbGetChirpById(chirpId);
    if (!chirps) {
        throw new error.NotFoundError(`No chirp found with id: ${chirpId}`);
    }
    js.responseJSON(res, 200, chirps);
}
export async function deleteChirp(req, res) {
    console.log("Received delete request for: " + req.params.chirpId);
    const id = req.params.chirpId;
    if (!id) {
        throw new error.NotFoundError("Chirp not found");
    }
    const chirp = await dbGetChirpById(id);
    const authToken = getBearerToken(req);
    const userToken = validateJWT(authToken, config.api.secret);
    if (chirp.userId !== userToken) {
        throw new error.ForbiddenError("Not authorized to delete this chirp");
    }
    console.log("Authenticated. Deleting chirp by id: " + chirp.id);
    const deletedChirp = await deleteChirpById(chirp.id);
    res.status(204).send();
}
