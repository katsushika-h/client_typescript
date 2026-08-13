process.loadEnvFile(".env");
const migrationConfig = {
    migrationsFolder: "src/db",
};
function envOrThrow(key) {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
}
export const config = {
    api: {
        fileserverHits: 0,
        platform: envOrThrow("PLATFORM"),
        secret: envOrThrow("SECRET")
    },
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig,
    },
};
