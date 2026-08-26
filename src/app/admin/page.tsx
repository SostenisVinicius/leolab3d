import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  MessageSquareQuote,
  Plus,
  UsersRound,
} from "lucide-react";
import { getAdminDashboard } from "@/lib/admin-data";
import { requireAdmin } from "@/lib/session";
import { formatCurrency, statusLabels } from "@/lib/utils";

export default async function AdminDashboard() {
  const [session, data] = await Promise.all([requireAdmin(), getAdminDashboard()]);
  const firstName = session.user.name.split(" ")[0];
  const date = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date());
  const pending = (data.quotes.pending ?? 0) + (data.quotes.reviewing ?? 0);
  return (
    <>
      <header className="admin-header admin-welcome">
        <div>
          <span>{date}</span>
          <h1>Olá, {firstName}.</h1>
          <p>Este é o panorama atual do seu laboratório.</p>
        </div>
        <div className="admin-header-actions">
          <Link className="button button-ghost" href="/admin/pedidos">
            Ver pedidos
          </Link>
          <Link className="button" href="/admin/produtos/novo">
            <Plus /> Novo produto
          </Link>
        </div>
      </header>
      <section className="admin-content">
        <div className="dashboard-stats modern">
          <article>
            <i className="amber">
              <MessageSquareQuote />
            </i>
            <div>
              <span>Precisam de atenção</span>
              <strong>{pending}</strong>
              <small>{data.quotes.pending ?? 0} ainda não analisados</small>
            </div>
          </article>
          <article>
            <i className="violet">
              <Clock3 />
            </i>
            <div>
              <span>Em produção</span>
              <strong>{data.quotes.in_production ?? 0}</strong>
              <small>pedidos em andamento</small>
            </div>
          </article>
          <article>
            <i className="green">
              <CircleDollarSign />
            </i>
            <div>
              <span>Volume aprovado</span>
              <strong>{formatCurrency(data.approvedValue)}</strong>
              <small>propostas aceitas</small>
            </div>
          </article>
          <article>
            <i className="blue">
              <Boxes />
            </i>
            <div>
              <span>Catálogo publicado</span>
              <strong>{data.catalog.published ?? 0}</strong>
              <small>{data.catalog.draft ?? 0} rascunhos</small>
            </div>
          </article>
        </div>
        <div className="dashboard-grid modern-grid">
          <div className="data-card">
            <div className="data-card-title">
              <div>
                <h2>Pedidos recentes</h2>
                <p>Priorize as solicitações que aguardam resposta.</p>
              </div>
              <Link href="/admin/pedidos">
                Ver todos <ArrowRight />
              </Link>
            </div>
            {data.recentQuotes.length ? (
              data.recentQuotes.map((q) => (
                <Link href={`/admin/pedidos/${q.id}`} className="admin-order-row" key={q.id}>
                  <span className="avatar">
                    {q.customerName
                      .split(" ")
                      .map((x) => x[0])
                      .join("")
                      .slice(0, 2)}
                  </span>
                  <div>
                    <strong>{q.title}</strong>
                    <small>
                      {q.customerName} · {q.protocol}
                    </small>
                  </div>
                  <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
                  <b>{formatCurrency(q.proposedPriceCents)}</b>
                </Link>
              ))
            ) : (
              <div className="admin-empty">
                <MessageSquareQuote />
                <h3>Nenhum pedido ainda</h3>
                <p>As novas solicitações aparecerão aqui.</p>
              </div>
            )}
          </div>
          <aside className="dashboard-side">
            <div className="data-card team-summary">
              <div className="data-card-title">
                <h2>Pessoas</h2>
                <Link href="/admin/equipe">Gerenciar</Link>
              </div>
              <div>
                <UsersRound />
                <span>
                  <strong>{data.people.customer ?? 0}</strong>
                  <small>clientes cadastrados</small>
                </span>
              </div>
              <div>
                <span className="admin-mini-icon">A</span>
                <span>
                  <strong>{data.people.admin ?? 0}</strong>
                  <small>administradores</small>
                </span>
              </div>
            </div>
            <div className="data-card quick-actions">
              <h2>Ações rápidas</h2>
              <Link href="/admin/produtos/novo">
                <Plus /> Cadastrar produto
              </Link>
              <Link href="/admin/colecoes/nova">
                <Plus /> Criar coleção
              </Link>
              <Link href="/admin/equipe">
                <UsersRound /> Gerenciar equipe
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
