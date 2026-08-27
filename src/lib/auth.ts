import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { dash } from "@better-auth/infra";
import { databaseConfigured, db } from "@/db";
import * as schema from "@/db/schema";

const authSchema = {
  ...schema,
  user: schema.users,
  session: schema.sessions,
  account: schema.accounts,
  verification: schema.verifications,
};

const productionURL = process.env.BETTER_AUTH_URL ?? "https://leolab3d.vercel.app";
const authBaseURL =
  process.env.VERCEL === "1"
    ? {
        allowedHosts: ["leolab3d.vercel.app", "leolab3d-*.vercel.app"],
        protocol: "https" as const,
        fallback: productionURL,
      }
    : {
        allowedHosts: ["localhost:*", "127.0.0.1:*"],
        protocol: "http" as const,
        fallback: "http://localhost:3000",
      };

export const auth = betterAuth({
  baseURL: authBaseURL,
  secret:
    process.env.BETTER_AUTH_SECRET ??
    (databaseConfigured ? undefined : "leolab3d-demo-only-secret-32-chars"),
  database: drizzleAdapter(db, { provider: "pg", schema: authSchema }),
  emailAndPassword: { enabled: true, minPasswordLength: 8 },
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: false },
      phone: { type: "string", required: false },
    },
  },
  plugins: [dash({ apiKey: process.env.BETTER_AUTH_API_KEY }), nextCookies()],
});
