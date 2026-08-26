import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { demoQuotes } from "@/lib/demo-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = demoQuotes.find((x) => x.id === id);
  if (!q) notFound();
  return (
    <>
      <header className="admin-header detail-admin-head">
        <div>
          <Link href="/admin/pedidos" className="back-link">
            <ArrowLeft /> Pedidos
          </Link>
          <small>{q.protocol}</small>
          <h1>{q.title}</h1>
        </div>
        <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
      </header>
      <section className="admin-content order-admin-grid">
        <div>
          <div className="data-card order-section">
            <h2>Detalhes da solicitação</h2>
            <p>
              Gostaria de uma peça personalizada com acabamento premium, base identificada e cores
              próximas à referência. A escala pode ser ajustada conforme a recomendação do
              laboratório.
            </p>
            <div className="request-meta">
              <span>
                Quantidade<strong>1 unidade</strong>
              </span>
              <span>
                Prazo desejado<strong>20 de setembro</strong>
              </span>
              <span>
                Tipo<strong>Peça do catálogo</strong>
              </span>
            </div>
          </div>
          <div className="data-card order-section">
            <h2>Histórico</h2>
            <div className="history-line">
              <i />
              <div>
                <strong>Solicitação recebida</strong>
                <p>Pedido criado pelo cliente.</p>
                <small>{q.date}</small>
              </div>
            </div>
          </div>
        </div>
        <aside>
          <div className="data-card customer-card">
            <h2>Cliente</h2>
            <strong>{q.customer}</strong>
            <a href="#">
              <Mail /> cliente@email.com
            </a>
            <a href="#">
              <Phone /> (11) 99999-9999
            </a>
            <span>
              <CalendarDays /> Cliente desde ago. 2026
            </span>
          </div>
          <form className="data-card proposal-form">
            <h2>Análise e proposta</h2>
            <label>
              Status
              <select defaultValue={q.status}>
                <option value="pending">Pendente</option>
                <option value="reviewing">Em análise</option>
                <option value="waiting_customer">Aguardando cliente</option>
                <option value="approved">Aprovado</option>
                <option value="in_production">Em produção</option>
                <option value="completed">Concluído</option>
                <option value="rejected">Recusado</option>
              </select>
            </label>
            <label>
              Valor proposto (R$)
              <input type="number" defaultValue={q.value ? q.value / 100 : ""} />
            </label>
            <label>
              Prazo estimado (dias)
              <input type="number" defaultValue="18" />
            </label>
            <label>
              Observações
              <textarea rows={4} placeholder="Mensagem visível para o cliente..." />
            </label>
            <button className="button">Salvar e notificar cliente</button>
            {q.value && (
              <p>
                Proposta atual: <strong>{formatCurrency(q.value)}</strong>
              </p>
            )}
          </form>
        </aside>
      </section>
    </>
  );
}
