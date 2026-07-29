import {Request, Response} from "express";
import express from "express";
const app = express();

export function readinessHandler(req: Request, res: Response): void {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK. The quick brown fox");
    console.log("Readiness endpoint accessed");
}