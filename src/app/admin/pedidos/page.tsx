import Link from "next/link";
import { Search } from "lucide-react";
import { getAdminQuotes } from "@/lib/admin-data";
import { formatCurrency, statusLabels } from "@/lib/utils";

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; busca?: string }>;
}) {
  const query = await searchParams;
  const quotes = await getAdminQuotes(query.status, query.busca);
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Central de demandas</span>
          <h1>Pedidos e orçamentos</h1>
          <p>Analise solicitações, envie propostas e acompanhe a produção.</p>
        </div>
      </header>
      <section className="admin-content">
        <form className="admin-toolbar order-filters">
          <label>
            <Search />
            <input
              name="busca"
              defaultValue={query.busca}
              placeholder="Protocolo, cliente ou peça..."
            />
          </label>
          <select name="status" defaultValue={query.status ?? ""}>
            <option value="">Todos os status</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <button className="button button-sm">Filtrar</button>
        </form>
        <div className="data-card table-card">
          <div className="table-head">
            <span>Pedido</span>
            <span>Cliente</span>
            <span>Status</span>
            <span>Valor</span>
            <span>Recebido em</span>
          </div>
          {quotes.length ? (
            quotes.map((q) => (
              <Link href={`/admin/pedidos/${q.id}`} className="table-row" key={q.id}>
                <div>
                  <small>{q.protocol}</small>
                  <strong>{q.title}</strong>
                </div>
                <span>{q.customerName}</span>
                <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
                <b>{formatCurrency(q.proposedPriceCents)}</b>
                <span>
                  {new Intl.DateTimeFormat("pt-BR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(q.createdAt)}
                </span>
              </Link>
            ))
          ) : (
            <div className="admin-empty">
              <span className="empty-symbol">LL</span>
              <h3>Nenhum pedido encontrado</h3>
              <p>Ajuste os filtros ou aguarde uma nova solicitação.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
