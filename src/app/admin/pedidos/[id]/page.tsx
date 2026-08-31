import Link from "next/link";
import { ArrowLeft, CalendarDays, Mail, Paperclip, Phone } from "lucide-react";
import { notFound } from "next/navigation";
import { updateQuote } from "@/app/actions/admin";
import { getAdminQuote } from "@/lib/admin-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
import { CurrencyInput } from "@/components/currency-input";

export default async function AdminOrder({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = await getAdminQuote(id);
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
            <p>{q.description}</p>
            <div className="request-meta">
              <span>
                Quantidade
                <strong>
                  {q.quantity} {q.quantity === 1 ? "unidade" : "unidades"}
                </strong>
              </span>
              <span>
                Prazo desejado
                <strong>
                  {q.desiredDate
                    ? new Intl.DateTimeFormat("pt-BR").format(q.desiredDate)
                    : "Não informado"}
                </strong>
              </span>
              <span>
                Tipo
                <strong>
                  {q.kind === "catalog" ? "Peça do catálogo" : "Projeto personalizado"}
                </strong>
              </span>
            </div>
            {q.items.length > 0 && (
              <div className="quote-items">
                <h3>Itens</h3>
                {q.items.map((item) => (
                  <span key={item.id}>
                    {item.productName}
                    <b>{item.quantity}x</b>
                  </span>
                ))}
              </div>
            )}
            {q.attachments.length > 0 && (
              <div className="quote-attachments">
                {q.attachments.map((file) => (
                  <a href={file.url} target="_blank" key={file.id}>
                    <Paperclip />
                    {file.fileName}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="data-card order-section">
            <h2>Histórico</h2>
            {q.history.length ? (
              q.history.map((event) => (
                <div className="history-line" key={event.id}>
                  <i />
                  <div>
                    <strong>{statusLabels[event.toStatus]}</strong>
                    {event.note && <p>{event.note}</p>}
                    <small>
                      {event.author?.name ?? "Sistema"} ·{" "}
                      {new Intl.DateTimeFormat("pt-BR", {
                        dateStyle: "short",
                        timeStyle: "short",
                      }).format(event.createdAt)}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <p className="muted-text">Nenhuma alteração registrada.</p>
            )}
          </div>
        </div>
        <aside>
          <div className="data-card customer-card">
            <h2>Cliente</h2>
            <strong>{q.customerName}</strong>
            <a href={`mailto:${q.customerEmail}`}>
              <Mail />
              {q.customerEmail}
            </a>
            <a href={`tel:${q.customerPhone}`}>
              <Phone />
              {q.customerPhone}
            </a>
            <span>
              <CalendarDays />
              Recebido em {new Intl.DateTimeFormat("pt-BR").format(q.createdAt)}
            </span>
          </div>
          <form action={updateQuote} className="data-card proposal-form">
            <input type="hidden" name="id" value={q.id} />
            <h2>Análise e proposta</h2>
            <label>
              Status
              <select name="status" defaultValue={q.status}>
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option value={value} key={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Valor proposto (R$)
              <CurrencyInput name="proposedPriceCents" initialCents={q.proposedPriceCents} />
            </label>
            <label>
              Prazo estimado (dias)
              <input
                name="estimatedDays"
                type="number"
                min="1"
                defaultValue={q.estimatedDays ?? ""}
              />
            </label>
            <label>
              Observações
              <textarea
                name="adminNotes"
                rows={5}
                defaultValue={q.adminNotes ?? ""}
                placeholder="Mensagem e detalhes da proposta..."
              />
            </label>
            <button className="button">Salvar atualização</button>
            {q.proposedPriceCents && (
              <p>
                Proposta atual: <strong>{formatCurrency(q.proposedPriceCents)}</strong>
              </p>
            )}
          </form>
        </aside>
      </section>
    </>
  );
}
