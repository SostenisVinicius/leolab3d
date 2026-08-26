import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
export default function LoginPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="kicker">Área do cliente</span>
        <h1>
          Bom ter você
          <br />
          de volta.
        </h1>
        <p>Acompanhe propostas e veja o andamento das suas peças.</p>
        <AuthForm mode="login" />
        <small>
          Ainda não tem acesso? <Link href="/cadastro">Criar conta</Link>
        </small>
      </div>
      <div className="auth-visual">
        <blockquote>“Cada camada aproxima uma ideia do mundo real.”</blockquote>
      </div>
    </section>
  );
}
