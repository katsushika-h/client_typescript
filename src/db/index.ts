// importing libraries
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
//importing local files
import * as schema from "./schema.js";
import {config} from  "../config.js";


// creating a connection to the database
const conn = postgres(config.db.url);
export const db = drizzle(conn, { schema });
const sql = postgres(config.db.url);

// Migration function to run migrations
const migrationClient = postgres(config.db.url, {max : 1});
await migrate(drizzle(migrationClient), config.db.migrationConfig);