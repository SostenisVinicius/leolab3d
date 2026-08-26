export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  image: string;
  material: string;
  dimensions: string;
  finish: string;
  estimatedDays: number;
  startingPriceCents?: number;
  featured?: boolean;
};

export type Collection = {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  image: string;
  productSlugs: string[];
};

export const products: Product[] = [
  {
    id: "1",
    slug: "sentinela-cyber",
    name: "Sentinela Cyber",
    category: "Sci-fi",
    shortDescription: "Busto colecionável com acabamento metálico e iluminação opcional.",
    description:
      "Uma peça de presença marcante, modelada para destacar os detalhes mecânicos e as superfícies facetadas. Pode receber pintura personalizada e base com identificação.",
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1200&q=85",
    material: "Resina premium",
    dimensions: "28 × 18 × 16 cm",
    finish: "Pintura manual acetinada",
    estimatedDays: 18,
    startingPriceCents: 69000,
    featured: true,
  },
  {
    id: "2",
    slug: "dragao-esmeralda",
    name: "Dragão Esmeralda",
    category: "Fantasia",
    shortDescription: "Escultura orgânica rica em textura, disponível em diferentes escalas.",
    description:
      "Criada para colecionadores de fantasia, esta peça combina escamas detalhadas, pose dinâmica e uma base rochosa feita sob medida.",
    image:
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=1200&q=85",
    material: "Resina de alta definição",
    dimensions: "35 × 30 × 28 cm",
    finish: "Pintura manual multicamadas",
    estimatedDays: 25,
    startingPriceCents: 98000,
    featured: true,
  },
  {
    id: "3",
    slug: "astronauta-orbita",
    name: "Astronauta Órbita",
    category: "Design",
    shortDescription: "Arte decorativa contemporânea para ambientes criativos.",
    description:
      "Uma interpretação minimalista da exploração espacial, com formas limpas e opção de cores alinhada ao seu ambiente.",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=85",
    material: "PLA reforçado",
    dimensions: "24 × 15 × 14 cm",
    finish: "Fosco texturizado",
    estimatedDays: 12,
    startingPriceCents: 42000,
    featured: true,
  },
  {
    id: "4",
    slug: "raposa-geometrica",
    name: "Raposa Geométrica",
    category: "Low poly",
    shortDescription: "Decoração low poly com linhas precisas e personalidade.",
    description:
      "Peça leve e versátil para mesas, nichos ou presentes. Produzida em cores sólidas ou acabamento especial sob consulta.",
    image:
      "https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=85",
    material: "PLA ecológico",
    dimensions: "20 × 12 × 11 cm",
    finish: "Fosco",
    estimatedDays: 8,
    startingPriceCents: 24000,
  },
  {
    id: "5",
    slug: "mecha-zero",
    name: "Mecha Zero",
    category: "Sci-fi",
    shortDescription: "Figure articulada inspirada no universo mecha.",
    description:
      "Projeto modular com partes articuladas e várias possibilidades de pose, ideal para personalização de cores e insígnias.",
    image:
      "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=85",
    material: "Resina técnica",
    dimensions: "32 × 20 × 18 cm",
    finish: "Metálico envelhecido",
    estimatedDays: 22,
    startingPriceCents: 84000,
  },
  {
    id: "6",
    slug: "mascara-ancestral",
    name: "Máscara Ancestral",
    category: "Arte",
    shortDescription: "Escultura de parede com textura artesanal contemporânea.",
    description:
      "Uma peça autoral que une fabricação digital e acabamento manual, com suporte traseiro pronto para instalação.",
    image:
      "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=1200&q=85",
    material: "PLA e massa mineral",
    dimensions: "40 × 22 × 8 cm",
    finish: "Pátina mineral",
    estimatedDays: 15,
    startingPriceCents: 52000,
  },
];

export const collections: Collection[] = [
  {
    slug: "mundos-fantasticos",
    name: "Mundos Fantásticos",
    eyebrow: "Fantasia & aventura",
    description: "Criaturas, guardiões e relíquias que transformam imaginação em matéria.",
    image: products[1].image,
    productSlugs: ["dragao-esmeralda", "mascara-ancestral"],
  },
  {
    slug: "futuro-sintetico",
    name: "Futuro Sintético",
    eyebrow: "Sci-fi & mecha",
    description: "Tecnologia, exploração espacial e formas mecânicas em peças de alto impacto.",
    image: products[0].image,
    productSlugs: ["sentinela-cyber", "astronauta-orbita", "mecha-zero"],
  },
  {
    slug: "formas-essenciais",
    name: "Formas Essenciais",
    eyebrow: "Design & decoração",
    description: "Objetos autorais de linhas limpas para espaços que respiram criatividade.",
    image: products[3].image,
    productSlugs: ["raposa-geometrica", "astronauta-orbita"],
  },
];

export const demoQuotes = [
  {
    id: "1",
    protocol: "LL3D-2608-014",
    title: "Dragão Esmeralda — escala 1:6",
    customer: "Marina Costa",
    status: "pending",
    date: "26 ago, 09:42",
    value: null,
  },
  {
    id: "2",
    protocol: "LL3D-2508-011",
    title: "Miniatura personalizada de pet",
    customer: "André Lima",
    status: "reviewing",
    date: "25 ago, 16:18",
    value: null,
  },
  {
    id: "3",
    protocol: "LL3D-2408-008",
    title: "Sentinela Cyber — pintura custom",
    customer: "Rafael Nunes",
    status: "approved",
    date: "24 ago, 11:05",
    value: 79000,
  },
  {
    id: "4",
    protocol: "LL3D-2208-003",
    title: "Kit 12 troféus corporativos",
    customer: "Clara Alves",
    status: "in_production",
    date: "22 ago, 14:30",
    value: 168000,
  },
];
