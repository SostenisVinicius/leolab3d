import Link from "next/link";
import { ArrowUpRight, Plus } from "lucide-react";
import { demoQuotes } from "@/lib/demo-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
export default function Orders() {
  return (
    <>
      <header className="portal-header">
        <div>
          <span className="kicker">Área do cliente</span>
          <h1>Meus pedidos</h1>
          <p>Acompanhe propostas e produções em um só lugar.</p>
        </div>
        <Link href="/orcamento" className="button">
          <Plus /> Nova solicitação
        </Link>
      </header>
      <section className="portal-content">
        <div className="mini-stats">
          <div>
            <span>Em análise</span>
            <strong>1</strong>
          </div>
          <div>
            <span>Aprovados</span>
            <strong>1</strong>
          </div>
          <div>
            <span>Em produção</span>
            <strong>1</strong>
          </div>
        </div>
        <div className="data-card">
          <div className="data-card-title">
            <h2>Solicitações recentes</h2>
          </div>
          {demoQuotes.slice(0, 3).map((q) => (
            <Link href={`/minha-conta/pedidos/${q.id}`} className="order-row" key={q.id}>
              <div>
                <small>{q.protocol}</small>
                <strong>{q.title}</strong>
                <span>{q.date}</span>
              </div>
              <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
              <b>{formatCurrency(q.value)}</b>
              <ArrowUpRight />
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
