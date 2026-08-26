import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { demoQuotes } from "@/lib/demo-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
export default function AdminOrders() {
  return (
    <>
      <header className="admin-header">
        <div>
          <span>Demandas</span>
          <h1>Pedidos e orçamentos</h1>
          <p>Analise solicitações e acompanhe a fila de produção.</p>
        </div>
      </header>
      <section className="admin-content">
        <div className="admin-toolbar">
          <label>
            <Search />
            <input placeholder="Buscar protocolo, cliente ou peça..." />
          </label>
          <button>
            <SlidersHorizontal /> Filtros
          </button>
        </div>
        <div className="data-card table-card">
          <div className="table-head">
            <span>Pedido</span>
            <span>Cliente</span>
            <span>Status</span>
            <span>Valor</span>
            <span>Recebido em</span>
          </div>
          {demoQuotes.map((q) => (
            <Link href={`/admin/pedidos/${q.id}`} className="table-row" key={q.id}>
              <div>
                <small>{q.protocol}</small>
                <strong>{q.title}</strong>
              </div>
              <span>{q.customer}</span>
              <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
              <b>{formatCurrency(q.value)}</b>
              <span>{q.date}</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
