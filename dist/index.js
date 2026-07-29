import express from "express";
import { middlewareLogResponses } from "./api/middleware.js";
import { readinessHandler } from "./api/readiness.js";
const app = express();
const PORT = 8080;
app.use("/app", express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Health check endpoint
app.get("/healthz", readinessHandler);
app.use(middlewareLogResponses);
