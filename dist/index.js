import express from "express";
import { middlewareLogResponses, errorHandler, middlewareMetricsInc, handlerResetMetrics, handlerMetrics } from "./api/middleware.js";
import { valdiateChirp } from "./api/postlisten.js";
import { readinessHandler } from "./api/readiness.js";
const app = express();
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));
// Metrics endpoint
app.get("/admin/metrics", handlerMetrics);
// Reset Metrics endpoint
app.post("/admin/reset", handlerResetMetrics);
// Health check endpoint
app.get("/api/healthz", readinessHandler);
app.post("/api/validate_chirp", valdiateChirp);
app.use(errorHandler);
