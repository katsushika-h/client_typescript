import express, { Request, Response, NextFunction } from "express";
import { config } from "../config.js";
import { 
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
    ForbiddenError
 } from "./errorClasses.js";
import {responseJSON, responseError } from "./jsonhelper.js";

export const middlewareLogResponses = (req: Request, res: Response, next: NextFunction):void => {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        };
    });
    next();
};

export function middlewareMetricsInc(req: Request, res: Response, next: NextFunction): void {
    // Increment the fileserverHits counter for each request
    res.on("finish", () => {
        config.fileserverHits++;
});
    next();
}
// Reset Metrics endpoint
export function handlerResetMetrics(req: Request, res: Response): void {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("Metrics reset");
    console.log("Metrics reset");
}

// Metrics endpoint
export function handlerMetrics(req: Request, res: Response): void {
    res.set("Content-Type", "text/HTML; charset=utf-8");
    res.status(200).send(`<html>
  <body>
    <h1>Welcome, Chirpy Admin</h1>
    <p>Chirpy has been visited ${config.fileserverHits} times!</p>
  </body>
</html>`);
};


export async function errorHandler(err: any, req: Request, res: Response, next: Function): Promise<void> {
    console.log("Error handler invoked, error is "+err.message);
    if (err instanceof BadRequestError) {
        responseError(res, 400, err.message);
    } else if (err instanceof NotFoundError) {
        responseError(res, 404, err.message);
    } else if (err instanceof UnauthorizedError) {
        responseError(res, 401, err.message);
    } else if (err instanceof ForbiddenError) {
        responseError(res, 403, err.message);
    } else {
        responseError(res, 500, "Internal Server Error");
    }
    console.error("Error has occured:", err);
}