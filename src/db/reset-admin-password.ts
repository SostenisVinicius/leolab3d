import { loadEnvConfig } from "@next/env";
import { createLocalAccountIssuer } from "@better-auth/core/db";
import { eq } from "drizzle-orm";

async function main() {
  loadEnvConfig(process.cwd());

  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const newPassword = process.env.ADMIN_PASSWORD;
  const confirmed = process.env.RESET_ADMIN_PASSWORD === "true";

  if (!process.env.DATABASE_URL || !email || !newPassword) {
    throw new Error("Defina DATABASE_URL, ADMIN_EMAIL e ADMIN_PASSWORD antes da recuperação.");
  }

  if (!confirmed) {
    throw new Error("Defina RESET_ADMIN_PASSWORD=true para confirmar explicitamente a operação.");
  }

  if (newPassword.length < 8 || newPassword.length > 128) {
    throw new Error("ADMIN_PASSWORD deve ter entre 8 e 128 caracteres.");
  }

  const [{ db }, { users }, { auth }] = await Promise.all([
    import("./index"),
    import("./schema"),
    import("../lib/auth"),
  ]);

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });

  if (!user) {
    throw new Error("Administrador não encontrado. Execute npm run db:seed primeiro.");
  }

  if (user.role !== "admin") {
    throw new Error("A recuperação só pode ser usada para um perfil que já seja administrador.");
  }

  const context = await auth.$context;
  const passwordHash = await context.password.hash(newPassword);
  const credentialAccount = await context.internalAdapter.findCredentialAccount(user.id);

  if (credentialAccount) {
    await context.internalAdapter.updatePassword(user.id, passwordHash);
  } else {
    await context.internalAdapter.createAccount({
      userId: user.id,
      accountId: user.id,
      providerId: "credential",
      issuer: createLocalAccountIssuer("credential"),
      password: passwordHash,
    });
  }

  await context.internalAdapter.deleteUserSessions(user.id);

  console.log(`Senha do administrador redefinida: ${email}`);
  console.log("Sessões anteriores revogadas.");
}

main().catch((error: unknown) => {
  console.error("Falha ao redefinir a senha do administrador:", error);
  process.exitCode = 1;
});
