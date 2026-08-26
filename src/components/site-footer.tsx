import Link from "next/link";
import { Instagram, Mail, MessageCircle } from "lucide-react";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>
            Ideias ganham forma. Peças 3D sob medida, feitas com precisão e acabamento artesanal.
          </p>
          <div className="socials">
            <a href="#" aria-label="Instagram">
              <Instagram />
            </a>
            <a href="mailto:contato@leolab3d.com.br" aria-label="E-mail">
              <Mail />
            </a>
            <a href="#" aria-label="WhatsApp">
              <MessageCircle />
            </a>
          </div>
        </div>
        <div>
          <strong>Explore</strong>
          <Link href="/catalogo">Catálogo</Link>
          <Link href="/colecoes">Coleções</Link>
          <Link href="/como-funciona">Como funciona</Link>
        </div>
        <div>
          <strong>Atendimento</strong>
          <Link href="/orcamento">Peça personalizada</Link>
          <Link href="/minha-conta/pedidos">Meus pedidos</Link>
          <Link href="/entrar">Entrar</Link>
        </div>
        <div>
          <strong>LeoLab3D</strong>
          <p>
            São Paulo, SP
            <br />
            Seg–Sex, 9h às 18h
          </p>
          <a href="mailto:contato@leolab3d.com.br">contato@leolab3d.com.br</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 LeoLab3D. Todos os direitos reservados.</span>
        <span>Projetado e impresso no Brasil.</span>
      </div>
    </footer>
  );
}
