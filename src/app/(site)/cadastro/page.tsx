import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function SignupPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="kicker">Comece por aqui</span>
        <h1>
          Crie sua conta
          <br />
          LeoLab3D.
        </h1>
        <p>Centralize seus orçamentos e acompanhe cada etapa.</p>
        <AuthForm mode="signup" />
        <small>
          Já tem uma conta? <Link href="/entrar">Entrar</Link>
        </small>
      </div>
      <div className="auth-visual signup">
        <blockquote>Sua próxima criação já tem um lugar para acontecer.</blockquote>
      </div>
    </section>
  );
}
