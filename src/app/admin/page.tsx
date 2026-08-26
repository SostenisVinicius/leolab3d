import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  CircleDollarSign,
  Clock3,
  FolderKanban,
  MessageSquareQuote,
  TrendingUp,
} from "lucide-react";
import { demoQuotes } from "@/lib/demo-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
export default function AdminDashboard() {
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Quarta-feira, 26 de agosto</span>
          <h1>Bom dia, Leo.</h1>
          <p>Aqui está o que está acontecendo no laboratório.</p>
        </div>
        <Link className="button" href="/admin/produtos/novo">
          + Novo produto
        </Link>
      </header>
      <section className="admin-content">
        <div className="dashboard-stats">
          <div>
            <i>
              <MessageSquareQuote />
            </i>
            <span>
              Pedidos pendentes<strong>4</strong>
              <small>
                <TrendingUp /> 2 novos hoje
              </small>
            </span>
          </div>
          <div>
            <i>
              <Clock3 />
            </i>
            <span>
              Em produção<strong>7</strong>
              <small>3 vencem esta semana</small>
            </span>
          </div>
          <div>
            <i>
              <CircleDollarSign />
            </i>
            <span>
              Propostas aprovadas<strong>R$ 6,4 mil</strong>
              <small>este mês</small>
            </span>
          </div>
          <div>
            <i>
              <Boxes />
            </i>
            <span>
              Produtos publicados<strong>24</strong>
              <small>em 3 coleções</small>
            </span>
          </div>
        </div>
        <div className="dashboard-grid">
          <div className="data-card">
            <div className="data-card-title">
              <div>
                <h2>Pedidos recentes</h2>
                <p>Demandas que precisam da sua atenção.</p>
              </div>
              <Link href="/admin/pedidos">
                Ver todos <ArrowRight />
              </Link>
            </div>
            {demoQuotes.map((q) => (
              <Link href={`/admin/pedidos/${q.id}`} className="admin-order-row" key={q.id}>
                <span className="avatar">
                  {q.customer
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <strong>{q.title}</strong>
                  <small>
                    {q.customer} · {q.protocol}
                  </small>
                </div>
                <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
                <b>{formatCurrency(q.value)}</b>
              </Link>
            ))}
          </div>
          <div className="data-card quick-card">
            <div className="data-card-title">
              <h2>Acesso rápido</h2>
            </div>
            <Link href="/admin/produtos">
              <Boxes />
              <span>
                <strong>Gerenciar produtos</strong>
                <small>24 itens cadastrados</small>
              </span>
              <ArrowRight />
            </Link>
            <Link href="/admin/colecoes">
              <FolderKanban />
              <span>
                <strong>Organizar coleções</strong>
                <small>3 coleções ativas</small>
              </span>
              <ArrowRight />
            </Link>
            <Link href="/admin/pedidos">
              <MessageSquareQuote />
              <span>
                <strong>Analisar pedidos</strong>
                <small>4 aguardando resposta</small>
              </span>
              <ArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
