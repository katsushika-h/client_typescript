process.loadEnvFile(".env");
import type {MigrationConfig} from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
    migrationsFolder: "src/db",
};

type DBConfig = {
    url: string;
    migrationConfig: MigrationConfig;
}

type APIconfig = {
    fileserverHits: number;
    platform: string;
    secret: string;
};

type Config = {
    api: APIconfig;
    db: DBConfig;
};  

function envOrThrow(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}


export const config: Config = {
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
