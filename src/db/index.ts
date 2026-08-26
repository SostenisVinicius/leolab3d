import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

export const databaseConfigured = Boolean(process.env.DATABASE_URL);
const sql = neon(process.env.DATABASE_URL ?? "postgresql://demo:demo@localhost/demo");
export const db = drizzle({ client: sql, schema });
