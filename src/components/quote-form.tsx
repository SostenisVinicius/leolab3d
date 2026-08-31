"use client";

import { useActionState, useState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { createQuote } from "@/app/actions/quotes";
import { QuoteAttachmentsUpload } from "@/components/quote-attachments-upload";
import type { QuoteState } from "@/lib/validators";

const initial: QuoteState = { success: false, message: "" };
const FieldError = ({ name, errors }: { name: string; errors?: Record<string, string[]> }) =>
  errors?.[name]?.[0] ? <small className="field-error">{errors[name][0]}</small> : null;

export function QuoteForm({ product }: { product?: { id: string; name: string } }) {
  const [state, action, pending] = useActionState(createQuote, initial);
  const [phone, setPhone] = useState("");
  const isCatalog = Boolean(product);

  if (state.success)
    return (
      <div className="success-panel">
        <CheckCircle2 />
        <span>Solicitação enviada</span>
        <h2>Agora é com o laboratório.</h2>
        <p>{state.message} Nossa equipe analisará os detalhes e entrará em contato.</p>
        <div className="protocol">
          Protocolo <strong>{state.protocol}</strong>
        </div>
        <a className="button" href="/catalogo">
          Voltar ao catálogo
        </a>
      </div>
    );

  return (
    <form action={action} className="quote-form">
      <input type="hidden" name="kind" value={isCatalog ? "catalog" : "custom"} />
      {product && (
        <div className="selected-product">
          <span>Peça selecionada</span>
          <strong>{product.name}</strong>
          <input type="hidden" name="productId" value={product.id} />
          <input type="hidden" name="productName" value={product.name} />
        </div>
      )}

      <div className="form-section">
        <div className="form-section-title">
          <b>01</b>
          <div>
            <h3>Sobre você</h3>
            <p>Como podemos falar com você?</p>
          </div>
        </div>
        <div className="form-grid">
          <label>
            Nome completo
            <input name="name" placeholder="Seu nome" />
            <FieldError name="name" errors={state.errors} />
          </label>
          <label>
            E-mail
            <input name="email" type="email" placeholder="voce@email.com" />
            <FieldError name="email" errors={state.errors} />
          </label>
          <label className="full">
            WhatsApp
            <input
              name="phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="(11) 99999-9999"
            />
            <FieldError name="phone" errors={state.errors} />
          </label>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <b>02</b>
          <div>
            <h3>{isCatalog ? "Sobre o pedido" : "Sua ideia"}</h3>
            <p>
              {isCatalog
                ? "Já sabemos qual é a peça. Só precisamos dos detalhes do seu pedido."
                : "Quanto mais detalhes, melhor a análise."}
            </p>
          </div>
        </div>
        <div className="form-grid">
          {!isCatalog && (
            <label className="full">
              Nome do projeto
              <input name="title" placeholder="Ex.: miniatura personalizada" />
              <FieldError name="title" errors={state.errors} />
            </label>
          )}
          <label>
            Quantidade
            <input name="quantity" type="number" min="1" defaultValue="1" />
            <FieldError name="quantity" errors={state.errors} />
          </label>
          <label>
            Data desejada <span>(opcional)</span>
            <input name="desiredDate" type="date" />
          </label>

          {isCatalog ? (
            <label className="full">
              Observações <span>(opcional)</span>
              <textarea
                name="notes"
                rows={5}
                placeholder="Cor, acabamento, personalização ou qualquer detalhe importante..."
              />
              <FieldError name="notes" errors={state.errors} />
            </label>
          ) : (
            <>
              <label className="full">
                Descreva a peça
                <textarea
                  name="description"
                  rows={6}
                  placeholder="Conte sobre tamanho, estilo, cores, uso e detalhes importantes..."
                />
                <FieldError name="description" errors={state.errors} />
              </label>
              <QuoteAttachmentsUpload phone={phone} />
            </>
          )}
        </div>
      </div>

      {state.message && <p className="form-message">{state.message}</p>}
      <button className="button submit-button" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="spin" /> Enviando...
          </>
        ) : (
          <>
            Enviar para análise <ArrowRight />
          </>
        )}
      </button>
      <p className="form-disclaimer">
        O envio não gera cobrança. Todos os pedidos dependem de análise e aprovação do
        administrador.
      </p>
    </form>
  );
}
