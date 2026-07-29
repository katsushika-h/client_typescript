import { config } from "../config.js";
export const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode >= 400) {
            console.log(`[NON-OK] ${req.method} ${req.url} - Status: ${res.statusCode}`);
        }
        ;
    });
    next();
};
export function middlewareMetricsInc(req, res, next) {
    // Increment the fileserverHits counter for each request
    res.on("finish", () => {
        config.fileserverHits++;
    });
    next();
}
export function handlerResetMetrics(req, res) {
    config.fileserverHits = 0;
    res.set("Content-Type", "text/plain; charset=utf-8");
    res.status(200).send("Metrics reset");
    console.log("Metrics reset");
}
