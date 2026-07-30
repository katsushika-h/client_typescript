import { responseJSON } from "./jsonhelper.js";
import { BadRequestError } from "./errorClasses.js";
export async function valdiateChirp(req, res) {
    const maxChirpLength = 140;
    //Filtered Words
    const re = /\b(kerfuffle|sharbert|fornax)\b/gi;
    console.log("Received request body:", req.body);
    let stringbody = (req.body);
    if (stringbody.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    }
    // Filter the request body for the specified words
    const filtered = stringbody.body.replace(re, "****");
    responseJSON(res, 200, { "cleanedBody": filtered });
}
;
