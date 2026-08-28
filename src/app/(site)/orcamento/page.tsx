import { QuoteForm } from "@/components/quote-form";
import { getPublishedProduct } from "@/lib/public-data";

export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ peca?: string }>;
}) {
  const { peca } = await searchParams;
  const product = peca ? await getPublishedProduct(peca) : null;
  return (
    <>
      <section className="page-hero quote-hero">
        <div className="container">
          <span className="kicker">Seu projeto começa aqui</span>
          <h1>
            Conte o que você
            <br />
            <em>quer transformar.</em>
          </h1>
          <p>
            Preencha os detalhes abaixo. Nossa equipe analisará a viabilidade, materiais e prazo
            antes de enviar uma proposta.
          </p>
        </div>
      </section>
      <section className="section quote-section">
        <div className="container quote-layout">
          <aside>
            <span>Como funciona</span>
            <ol>
              <li>
                <b>1</b>
                <div>
                  <strong>Você envia</strong>
                  <p>Detalhes e referências do projeto.</p>
                </div>
              </li>
              <li>
                <b>2</b>
                <div>
                  <strong>Nós analisamos</strong>
                  <p>Viabilidade, material, valor e prazo.</p>
                </div>
              </li>
              <li>
                <b>3</b>
                <div>
                  <strong>Você aprova</strong>
                  <p>A produção só começa após seu aceite.</p>
                </div>
              </li>
            </ol>
            <div className="secure-note">
              Seus dados são usados apenas para atender esta solicitação.
            </div>
          </aside>
          <QuoteForm product={product ? { id: product.id, name: product.name } : undefined} />
        </div>
      </section>
    </>
  );
}
