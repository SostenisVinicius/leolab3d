"use client";

import Link from "next/link";
import { Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "./logo";

const links = [
  ["Catálogo", "/catalogo"],
  ["Coleções", "/colecoes"],
  ["Como funciona", "/como-funciona"],
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Logo />
        <nav className={open ? "nav-links open" : "nav-links"} aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
          <Link href="/entrar" className="nav-account">
            <UserRound size={17} /> Entrar
          </Link>
          <Link href="/orcamento" className="button button-sm">
            Solicitar orçamento
          </Link>
        </nav>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Abrir menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
