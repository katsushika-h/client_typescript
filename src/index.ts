import express from "express";
import { Request, Response } from "express";
const app = express();
const PORT = 8080;


app.use("/app", express.static("./src/app"));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Health check endpoint
app.get("/healthz", (req: Request, res: Response) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("OK. The quick brown fox");
    console.log("Health check endpoint accessed");
});

//const middlewareLogResponses = (req: Request, res: Response, next: Function) => {
//    if (res.statusCode >= 400) {