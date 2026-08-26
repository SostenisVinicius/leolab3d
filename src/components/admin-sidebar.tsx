"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Boxes,
  ExternalLink,
  FolderKanban,
  LayoutDashboard,
  MessageSquareQuote,
  UsersRound,
} from "lucide-react";
import { Logo } from "./logo";
import { SignOutButton } from "./sign-out-button";

const links = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/pedidos", label: "Pedidos", icon: MessageSquareQuote },
  { href: "/admin/produtos", label: "Produtos", icon: Boxes },
  { href: "/admin/colecoes", label: "Coleções", icon: FolderKanban },
  { href: "/admin/equipe", label: "Equipe", icon: UsersRound },
];

export function AdminSidebar({
  user,
  pendingCount,
}: {
  user: { name: string; email: string };
  pendingCount: number;
}) {
  const pathname = usePathname();
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <aside className="admin-sidebar">
      <Logo />
      <div className="admin-workspace">
        <span>Workspace</span>
        <strong>LeoLab3D</strong>
      </div>
      <nav aria-label="Administração">
        {links.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link key={href} href={href} className={active ? "active" : ""}>
              <Icon />
              <span>{label}</span>
              {label === "Pedidos" && pendingCount > 0 && <i>{pendingCount}</i>}
            </Link>
          );
        })}
      </nav>
      <div className="admin-bottom">
        <Link href="/" target="_blank">
          <ExternalLink /> Ver loja
        </Link>
        <div className="admin-user">
          <span>{initials}</span>
          <div>
            <strong>{user.name}</strong>
            <small>{user.email}</small>
          </div>
        </div>
        <SignOutButton />
      </div>
    </aside>
  );
}
