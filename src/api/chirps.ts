import { Request, Response } from "express";
import * as js from "./jsonhelper.js";  
import { BadRequestError, NotFoundError } from "./errorClasses.js";
import { addChirp, allChirps, dbGetChirpById } from "../db/queries/chirps.js";

export async function createChirp(req: Request, res: Response): Promise<void> {
    const maxChirpLength = 140;
    //Filtered Words
    const re = /\b(kerfuffle|sharbert|fornax)\b/gi

    type jsonBody = {
        body: string;
        userId: string;
    };
    console.log("Received chirp body:", req.body);
        
    let chirpBody: jsonBody = (req.body);

    if (chirpBody.body.length > maxChirpLength) {
        throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
    } 

    // Filter the request body for the specified words
    const filtered = chirpBody.body.replace(re, "****");
    // js.responseJSON(res, 200, { "cleanedBody" : filtered });
    const createdChirp = await addChirp({ body: filtered, userId: chirpBody.userId });
    js.responseJSON(res, 201, createdChirp);
    };


export async function getChirps(req: Request, res: Response): Promise<void> {

    // Fetches chirp from server in ascending order.
        const chirps = await allChirps();
        js.responseJSON(res, 200, chirps);
    }

export async function getChirpById(req: Request, res: Response): Promise<void> {
    const chirpId = req.params.chirpId as string;
    if (!chirpId) {
        throw new BadRequestError("Missing chirpId parameter");
    }
    const chirps = await dbGetChirpById(chirpId);

    if (!chirps) {
        throw new NotFoundError(`No chirp found with id: ${chirpId}`);
    }
    js.responseJSON(res, 200, chirps);
}   