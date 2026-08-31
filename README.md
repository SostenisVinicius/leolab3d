# LeoLab3D

Catálogo e central de orçamentos para peças 3D personalizadas. Usa Next.js App Router, Drizzle ORM, Neon PostgreSQL, Better Auth e Vercel Blob.

## Funcionalidades

- Home, catálogo, coleções e detalhes de peças responsivos.
- Orçamento de produto cadastrado ou projeto personalizado.
- Novos pedidos começam pendentes de análise administrativa.
- Área do cliente para acompanhar propostas e produção.
- `/admin` com dashboard real, pedidos, produtos, coleções e gestão da equipe.
- Produtos podem participar de várias coleções.
- Autenticação por e-mail/senha e autorização por papel.
- Upload autenticado para Vercel Blob (imagens de até 8 MB).
- Upload por clique ou arrastar e soltar com preview e progresso.
- CRUD administrativo real de produtos e coleções no Neon.
- Catálogo público lê do Neon e mostra apenas conteúdo publicado.
- Exclusão de produtos e coleções com confirmação e limpeza de imagens no Blob.
- Campos monetários no padrão brasileiro, persistidos em centavos.
- Confirmação visual das ações administrativas por toast.

## Configuração local

```bash
npm install
copy .env.example .env.local
npm run db:generate
npm run db:migrate
npm run dev
```

Preencha `DATABASE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `BETTER_AUTH_API_KEY` e `BLOB_READ_WRITE_TOKEN`. Na Vercel, conecte Neon e Blob e replique as variáveis.

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

Depois do primeiro administrador, novos acessos são gerenciados em `/admin/equipe`: a pessoa cria uma conta normal e um administrador promove o perfil. O sistema impede auto-rebaixamento e remoção do último administrador, registrando cada mudança em `user_role_history`.

Se for necessário recuperar a senha do primeiro administrador, defina `ADMIN_EMAIL`, `ADMIN_PASSWORD` e `RESET_ADMIN_PASSWORD=true` apenas no ambiente local e execute `npm run db:reset-admin-password`. O comando usa o hasher do Better Auth e revoga as sessões anteriores. Remova a confirmação e a senha do ambiente após o uso.

## Comandos

- `npm run dev`, `lint`, `lint:fix`, `format`, `format:check`, `typecheck`, `test` e `build`.
- `npm run db:generate`, `db:migrate`, `db:push` e `db:studio`.

## Publicação e visibilidade

Produtos e coleções têm três estados. O padrão de um novo registro é rascunho.

| Status    | Admin   | Público |
| --------- | ------- | ------- |
| Rascunho  | Visível | Oculto  |
| Publicado | Visível | Visível |
| Arquivado | Visível | Oculto  |

Home, catálogo, coleções, detalhe da peça e orçamento consultam o Neon por `src/lib/public-data.ts` e retornam apenas registros publicados — inclusive dentro de uma coleção publicada. URLs de itens não publicados respondem 404. Ao salvar como publicado, as ações revalidam `/`, `/catalogo`, `/colecoes`, `/pecas/[slug]` e `/colecoes/[slug]`, então o conteúdo aparece imediatamente.

O catálogo filtra por coleção real (`/catalogo?colecao=slug`) e por busca em nome e resumo, preservando ambos os parâmetros entre filtros.

## Exclusão

As telas de edição têm uma zona de exclusão com confirmação em `<dialog>`. Excluir um produto remove seus vínculos com coleções e suas imagens auxiliares; os pedidos antigos preservam nome e quantidade porque `quote_request_items.product_id` usa `on delete set null`. Excluir uma coleção remove apenas o agrupamento e seus vínculos — os produtos continuam no catálogo. Imagens hospedadas no Blob da aplicação são removidas junto; URLs externas ficam intactas, e uma falha na limpeza é registrada em log sem impedir a exclusão.

## Modo demo

O catálogo público exige `DATABASE_URL`. Sem Neon configurado, apenas as telas da conta ainda usam conteúdo demonstrativo. Autenticação, orçamentos, dashboard administrativo, pedidos, produtos, coleções e equipe usam PostgreSQL. As ações compostas usam lotes atômicos compatíveis com o driver Neon HTTP.
