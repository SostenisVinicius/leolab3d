import Link from "next/link";
import { Boxes, FolderKanban, LayoutDashboard, MessageSquareQuote, Settings } from "lucide-react";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";
export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <Logo />
      <div className="admin-label">Administração</div>
      <nav>
        <Link href="/admin">
          <LayoutDashboard /> Visão geral
        </Link>
        <Link href="/admin/pedidos">
          <MessageSquareQuote /> Pedidos <i>4</i>
        </Link>
        <Link href="/admin/produtos">
          <Boxes /> Produtos
        </Link>
        <Link href="/admin/colecoes">
          <FolderKanban /> Coleções
        </Link>
      </nav>
      <nav className="admin-bottom">
        <Link href="/">
          <Settings /> Ver site
        </Link>
        <SignOutButton />
      </nav>
    </aside>
  );
}
