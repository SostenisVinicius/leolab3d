import Link from "next/link";
import { ArrowLeft, Check, Circle } from "lucide-react";
import { demoQuotes } from "@/lib/demo-data";
import { formatCurrency, statusLabels } from "@/lib/utils";
import { notFound } from "next/navigation";
export default async function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const q = demoQuotes.find((x) => x.id === id);
  if (!q) notFound();
  return (
    <section className="portal-content">
      <Link className="back-link" href="/minha-conta/pedidos">
        <ArrowLeft /> Voltar aos pedidos
      </Link>
      <div className="detail-head">
        <div>
          <small>{q.protocol}</small>
          <h1>{q.title}</h1>
          <p>Solicitado em {q.date}</p>
        </div>
        <span className={`status status-${q.status}`}>{statusLabels[q.status]}</span>
      </div>
      <div className="account-detail-grid">
        <div className="data-card">
          <h2>Andamento</h2>
          {[
            "Solicitação recebida",
            "Análise técnica",
            "Proposta enviada",
            "Produção",
            "Concluído",
          ].map((s, i) => (
            <div className={i < 2 ? "timeline-item done" : "timeline-item"} key={s}>
              {i < 2 ? <Check /> : <Circle />}
              <div>
                <strong>{s}</strong>
                <p>
                  {i === 0
                    ? "Recebemos os detalhes do seu projeto."
                    : i === 1
                      ? "Nossa equipe está avaliando materiais e acabamento."
                      : "Aguardando etapa anterior."}
                </p>
              </div>
            </div>
          ))}
        </div>
        <aside className="data-card summary-card">
          <h2>Resumo</h2>
          <span>
            Quantidade <b>1 unidade</b>
          </span>
          <span>
            Prazo estimado <b>A definir</b>
          </span>
          <span>
            Proposta <b>{formatCurrency(q.value)}</b>
          </span>
          <p>Você receberá um e-mail quando houver uma nova atualização.</p>
        </aside>
      </div>
    </section>
  );
}
