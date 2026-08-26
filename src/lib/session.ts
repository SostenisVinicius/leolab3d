import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "./auth";
import { databaseConfigured } from "@/db";

export async function getSession() {
  if (!databaseConfigured) return null;
  return auth.api.getSession({ headers: await headers() });
}
export async function requireUser() {
  const session = await getSession();
  if (!session) redirect("/entrar");
  return session;
}
export async function requireAdmin() {
  const session = await getSession();
  if (!session) redirect("/entrar");
  if ((session.user as { role?: string }).role !== "admin") redirect("/minha-conta/pedidos");
  return session;
}
