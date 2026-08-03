process.loadEnvFile("db.env");

type APIconfig = {
    fileserverHits: number;
    dbURL: string;
};

export const config: APIconfig = {
    fileserverHits: 0,
    dbURL: process.env.DB_URL!,
};
