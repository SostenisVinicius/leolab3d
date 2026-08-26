# LeoLab3D

Catálogo e central de orçamentos para peças 3D personalizadas. Usa Next.js App Router, Drizzle ORM, Neon PostgreSQL, Better Auth e Vercel Blob.

## Funcionalidades

- Home, catálogo, coleções e detalhes de peças responsivos.
- Orçamento de produto cadastrado ou projeto personalizado.
- Novos pedidos começam pendentes de análise administrativa.
- Área do cliente para acompanhar propostas e produção.
- `/admin` com dashboard, pedidos, produtos e coleções.
- Produtos podem participar de várias coleções.
- Autenticação por e-mail/senha e autorização por papel.
- Upload autenticado para Vercel Blob (imagens de até 8 MB).
- Modo demonstração automático sem `DATABASE_URL`.

## Configuração local

```bash
npm install
copy .env.example .env.local
npm run db:generate
npm run db:migrate
npm run dev
```

Preencha `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` e `BLOB_READ_WRITE_TOKEN`. Na Vercel, conecte Neon e Blob e replique as variáveis.

## Administrador inicial

Após as migrações, defina `ADMIN_EMAIL` e `ADMIN_PASSWORD` e execute:

```bash
npm run db:seed
```

O seed cria (quando necessário) e promove o administrador. Alternativamente, promova uma conta existente no Neon SQL Editor:

```sql
UPDATE users SET role = 'admin' WHERE email = 'seu-email@dominio.com';
```

Encerre a sessão e entre novamente. Rotas `/admin` verificam o papel no servidor.

## Comandos

- `npm run dev`, `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test` e `build`.
- `npm run db:generate`, `db:migrate`, `db:push` e `db:studio`.

## Modo demo

Sem `DATABASE_URL`, catálogo e painéis usam conteúdo demonstrativo. O formulário gera protocolo sem persistir. Com Neon configurado, autenticação e novos orçamentos usam PostgreSQL. Os formulários administrativos são parte do conceito visual e precisam ter suas actions conectadas antes do uso comercial.
