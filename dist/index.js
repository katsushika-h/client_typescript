import express from "express";
import { middlewareLogResponses, middlewareMetricsInc, handlerResetMetrics } from "./api/middleware.js";
import { readinessHandler } from "./api/readiness.js";
import { config } from "./config.js";
const app = express();
const PORT = 8080;
app.use(middlewareLogResponses);
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
// Metrics endpoint
app.get("/metrics", (req, res) => {
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send(`Hits: ${config.fileserverHits}`);
});
// Reset Metrics endpoint
app.get("/reset", handlerResetMetrics);
// Health check endpoint
app.get("/healthz", readinessHandler);
