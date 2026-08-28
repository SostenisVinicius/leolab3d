import Link from "next/link";
import { ArrowRight, Box, Check, Layers3, ScanLine, Sparkles } from "lucide-react";
import { ProductCard } from "@/components/product-card";
import { getPublishedCollections, getPublishedProducts } from "@/lib/public-data";

export default async function HomePage() {
  const [featured, recent, collections] = await Promise.all([
    getPublishedProducts({ featured: true, limit: 3 }),
    getPublishedProducts({ limit: 3 }),
    getPublishedCollections(3),
  ]);
  const products = featured.length ? featured : recent;
  return (
    <>
      <section className="hero">
        <div className="hero-glow" />
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={15} /> Impressão 3D além do esperado
            </div>
            <h1>
              Sua ideia.
              <br />
              <em>Nossa precisão.</em>
              <br />
              Uma peça única.
            </h1>
            <p>
              Transformamos personagens, memórias e conceitos em peças 3D com detalhes que
              surpreendem.
            </p>
            <div className="hero-actions">
              <Link href="/orcamento" className="button">
                Criar minha peça <ArrowRight />
              </Link>
              <Link href="/catalogo" className="button button-ghost">
                Explorar catálogo
              </Link>
            </div>
            <div className="trust">
              <span>
                <Check /> Orçamento sem compromisso
              </span>
              <span>
                <Check /> Acabamento manual
              </span>
            </div>
          </div>
          <div className="hero-art">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="hero-object">
              <div className="cube-face face-a">L3</div>
              <div className="cube-face face-b" />
              <div className="cube-face face-c" />
            </div>
            <div className="float-card card-a">
              <ScanLine />
              <span>
                <strong>0,05 mm</strong>Alta precisão
              </span>
            </div>
            <div className="float-card card-b">
              <Layers3 />
              <span>
                <strong>+800</strong>Peças criadas
              </span>
            </div>
          </div>
        </div>
      </section>
      <section className="stats">
        <div className="container stats-grid">
          <div>
            <strong>800+</strong>
            <span>peças produzidas</span>
          </div>
          <div>
            <strong>4,9</strong>
            <span>avaliação média</span>
          </div>
          <div>
            <strong>0,05 mm</strong>
            <span>precisão de impressão</span>
          </div>
          <div>
            <strong>100%</strong>
            <span>feito sob medida</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="kicker">Peças em destaque</span>
              <h2>Detalhes que contam histórias</h2>
              <p>
                Explore criações que já saíram do nosso laboratório ou use-as como ponto de partida.
              </p>
            </div>
            <Link href="/catalogo" className="text-link">
              Ver catálogo completo <ArrowRight />
            </Link>
          </div>
          <div className="product-grid">
            {products.map((p) => (
              <ProductCard product={p} key={p.id} />
            ))}
            {!products.length && (
              <div className="empty-state">
                <h3>O laboratório está preparando novidades</h3>
                <p>Você já pode solicitar uma criação exclusiva.</p>
                <Link className="button" href="/orcamento">
                  Criar minha peça
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="section section-dark">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="kicker">Coleções LeoLab</span>
              <h2>Universos para explorar</h2>
            </div>
            <Link href="/colecoes" className="text-link light">
              Todas as coleções <ArrowRight />
            </Link>
          </div>
          <div className="collection-grid">
            {collections.map((c, i) => (
              <Link
                href={`/colecoes/${c.slug}`}
                key={c.slug}
                className={`collection-card collection-${i + 1}`}
                style={{
                  backgroundImage: c.image
                    ? `linear-gradient(0deg, rgba(3,15,25,.96), rgba(3,15,25,.08)), url(${c.image})`
                    : "linear-gradient(145deg, #07384a, #03121d)",
                }}
              >
                <span>Coleção LeoLab3D</span>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <b>
                  Explorar coleção <ArrowRight />
                </b>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section className="section process">
        <div className="container">
          <div className="center-heading">
            <span className="kicker">Do conceito à realidade</span>
            <h2>Simples para você. Preciso por nós.</h2>
            <p>Você compartilha a ideia. Nós cuidamos de todo o resto.</p>
          </div>
          <div className="process-grid">
            <div>
              <i>01</i>
              <Box />
              <h3>Conte sua ideia</h3>
              <p>Escolha uma peça ou envie referências do seu projeto personalizado.</p>
            </div>
            <div>
              <i>02</i>
              <ScanLine />
              <h3>Receba a proposta</h3>
              <p>Analisamos detalhes, materiais e prazo antes de enviar o orçamento.</p>
            </div>
            <div>
              <i>03</i>
              <Layers3 />
              <h3>Acompanhe a criação</h3>
              <p>Após a aprovação, sua peça entra em produção e você acompanha o status.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="container cta">
        <div>
          <span className="kicker">Tem algo em mente?</span>
          <h2>Vamos dar forma à sua próxima ideia.</h2>
          <p>Envie suas referências e receba uma análise personalizada, sem compromisso.</p>
        </div>
        <Link href="/orcamento" className="button button-light">
          Solicitar orçamento <ArrowRight />
        </Link>
      </section>
    </>
  );
}
