import Link from "next/link";
import { LayoutDashboard, PackageSearch, UserRound } from "lucide-react";
import { Logo } from "@/components/logo";
import { databaseConfigured } from "@/db";
import { requireUser } from "@/lib/session";
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  if (databaseConfigured) await requireUser();
  return (
    <div className="portal">
      <aside className="portal-sidebar">
        <Logo />
        <nav>
          <Link href="/minha-conta/pedidos">
            <PackageSearch /> Meus pedidos
          </Link>
          <Link href="/catalogo">
            <LayoutDashboard /> Catálogo
          </Link>
          <Link href="/minha-conta/perfil">
            <UserRound /> Perfil
          </Link>
        </nav>
        <div>
          <span>Precisa de ajuda?</span>
          <a href="mailto:contato@leolab3d.com.br">Falar com a LeoLab</a>
        </div>
      </aside>
      <main className="portal-main">
        {!databaseConfigured && (
          <div className="demo-banner">
            Modo demonstração — conecte o Neon para habilitar dados reais e autenticação.
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
