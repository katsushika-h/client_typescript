import express from "express";
import { Request, Response } from "express";
import {middlewareLogResponses, errorHandler, middlewareMetricsInc, handlerResetMetrics, handlerMetrics} from "./api/middleware.js";
import {valdiateChirp} from "./api/postlisten.js";
import {readinessHandler} from "./api/readiness.js";
import {config} from "./config.js";
import {addUserByEmail } from "./api/users.js";
import { loginUser } from "./api/auth.js";
import {resetAll} from "./api/reset.js";
import { createChirp, getChirps, getChirpById } from "./api/chirps.js";
import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";


const app = express();
const PORT = 8080;

// migrate first
const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(middlewareLogResponses);
app.use(express.json());
app.use("/app", middlewareMetricsInc, express.static("./src/app"));

// Metrics endpoint
app.get("/admin/metrics", handlerMetrics);
// Reset Metrics endpoint
app.post("/admin/reset",  resetAll, handlerResetMetrics);
// Health check endpoint
app.get("/api/healthz", readinessHandler);
app.post("/api/validate_chirp", valdiateChirp);
app.post("/api/users", addUserByEmail);
app.post("/api/chirps", createChirp);
app.get("/api/chirps", getChirps);
app.get("/api/chirps/:chirpId", getChirpById);
app.post("/api/login", loginUser);

app.use(errorHandler);