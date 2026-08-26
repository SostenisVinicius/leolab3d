import { eq } from "drizzle-orm";
import { db } from "./index";
import { users } from "./schema";
import { auth } from "../lib/auth";

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!process.env.DATABASE_URL || !email || !password) {
  throw new Error("Defina DATABASE_URL, ADMIN_EMAIL e ADMIN_PASSWORD antes de executar o seed.");
}

if (password.length < 8) throw new Error("ADMIN_PASSWORD deve ter pelo menos 8 caracteres.");

const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
if (!existing) {
  const result = await auth.api.signUpEmail({
    body: { name: "Administrador LeoLab3D", email, password },
  });
  if (!result.user) throw new Error("Não foi possível criar o administrador.");
}

await db
  .update(users)
  .set({ role: "admin", emailVerified: true, updatedAt: new Date() })
  .where(eq(users.email, email));
console.log(`Administrador configurado: ${email}`);
