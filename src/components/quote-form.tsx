"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Paperclip } from "lucide-react";
import { createQuote } from "@/app/actions/quotes";
import type { QuoteState } from "@/lib/validators";

const initial: QuoteState = { success: false, message: "" };
const FieldError = ({ name, errors }: { name: string; errors?: Record<string, string[]> }) =>
  errors?.[name]?.[0] ? <small className="field-error">{errors[name][0]}</small> : null;

export function QuoteForm({ product }: { product?: { id: string; name: string } }) {
  const [state, action, pending] = useActionState(createQuote, initial);
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
            <input name="phone" placeholder="(11) 99999-9999" />
            <FieldError name="phone" errors={state.errors} />
          </label>
        </div>
      </div>
      <div className="form-section">
        <div className="form-section-title">
          <b>02</b>
          <div>
            <h3>Sua ideia</h3>
            <p>Quanto mais detalhes, melhor a análise.</p>
          </div>
        </div>
        <div className="form-grid">
          <label className="full">
            Nome do projeto
            <input
              name="title"
              defaultValue={product?.name ?? ""}
              placeholder="Ex.: miniatura personalizada"
            />
            <FieldError name="title" errors={state.errors} />
          </label>
          <label>
            Quantidade
            <input name="quantity" type="number" min="1" defaultValue="1" />
          </label>
          <label>
            Data desejada <span>(opcional)</span>
            <input name="desiredDate" type="date" />
          </label>
          <label className="full">
            Descreva a peça
            <textarea
              name="description"
              rows={6}
              placeholder="Conte sobre tamanho, estilo, cores, uso e detalhes importantes..."
            />
            <FieldError name="description" errors={state.errors} />
          </label>
          <div className="full upload-placeholder">
            <Paperclip />
            <div>
              <strong>Referências visuais</strong>
              <span>Uploads serão habilitados ao conectar o Vercel Blob.</span>
            </div>
          </div>
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
