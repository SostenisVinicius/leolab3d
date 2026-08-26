import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cuboid,
  FileSearch,
  MessageSquareText,
  PackageCheck,
} from "lucide-react";
const steps = [
  {
    icon: MessageSquareText,
    title: "Compartilhe a ideia",
    text: "Escolha uma peça do catálogo ou descreva um projeto novo. Referências, medidas e contexto ajudam na análise.",
  },
  {
    icon: FileSearch,
    title: "Análise do laboratório",
    text: "Avaliamos modelagem, material, escala, acabamento, quantidade e prazo antes de definir a proposta.",
  },
  {
    icon: CheckCircle2,
    title: "Aprovação transparente",
    text: "Você recebe valor, previsão e observações. Nada entra em produção sem a sua aprovação.",
  },
  {
    icon: Cuboid,
    title: "Produção e acabamento",
    text: "Imprimimos, tratamos e finalizamos cada detalhe conforme a especificação aprovada.",
  },
  {
    icon: PackageCheck,
    title: "Entrega da sua peça",
    text: "Após a conferência de qualidade, combinamos envio ou retirada e concluímos o pedido.",
  },
];
export default function HowPage() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="kicker">Como funciona</span>
          <h1>
            Da primeira conversa
            <br />
            <em>à peça pronta.</em>
          </h1>
          <p>
            Um processo claro, acompanhado e sem surpresas para transformar sua referência em
            realidade.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container timeline">
          {steps.map((s, i) => (
            <div key={s.title}>
              <span>0{i + 1}</span>
              <s.icon />
              <article>
                <h2>{s.title}</h2>
                <p>{s.text}</p>
              </article>
            </div>
          ))}
        </div>
      </section>
      <section className="container cta">
        <div>
          <span className="kicker">Pronto para começar?</span>
          <h2>Sua ideia pode ser a próxima.</h2>
        </div>
        <Link className="button button-light" href="/orcamento">
          Solicitar orçamento <ArrowRight />
        </Link>
      </section>
    </>
  );
}
