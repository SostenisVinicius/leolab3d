"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email"));
    const password = String(data.get("password"));
    const result =
      mode === "login"
        ? await authClient.signIn.email({ email, password })
        : await authClient.signUp.email({
            name: String(data.get("name")),
            email,
            password,
            phone: String(data.get("phone")),
          });
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? "Não foi possível continuar.");
      return;
    }
    router.push("/minha-conta/pedidos");
    router.refresh();
  }
  return (
    <form onSubmit={submit} className="auth-form">
      {mode === "signup" && (
        <>
          <label>
            Nome completo
            <input name="name" required placeholder="Seu nome" />
          </label>
          <label>
            WhatsApp
            <input name="phone" required placeholder="(11) 99999-9999" />
          </label>
        </>
      )}
      <label>
        E-mail
        <input name="email" type="email" required placeholder="voce@email.com" />
      </label>
      <label>
        Senha
        <input
          name="password"
          type="password"
          minLength={8}
          required
          placeholder="Mínimo de 8 caracteres"
        />
      </label>
      {error && <p className="form-message">{error}</p>}
      <button className="button" disabled={loading}>
        {loading ? (
          <>
            <LoaderCircle className="spin" /> Aguarde...
          </>
        ) : mode === "login" ? (
          "Entrar"
        ) : (
          "Criar minha conta"
        )}
      </button>
    </form>
  );
}
