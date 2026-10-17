# Gerenciador de Estoque - Backend

API REST para gerenciamento de estoque: produtos, categorias, fornecedores e
movimentações (entradas e saídas). Projeto feito como estudo de backend com
Node.js, TypeScript, Prisma e Docker.

## Stack

- Node.js 22 e TypeScript 7
- Express
- Prisma ORM 7 com driver adapter (`@prisma/adapter-pg`) e PostgreSQL
- Zod (validação dos dados de entrada)
- Docker / Docker Compose

## Funcionalidades

- [x] CRUD de Categoria
- [x] CRUD de Fornecedor
- [x] CRUD de Produto (com categoria e fornecedor na resposta)
- [x] Movimentações de estoque (entrada e saída) com transação
- [x] Bloqueio de saída com estoque insuficiente
- [x] Tratamento de erros centralizado
- [x] API e banco rodando com Docker Compose

## Pré-requisitos

- Node.js 22+
- Docker (no Windows, Docker Desktop com WSL2 habilitado)

## Como rodar

### Opção 1: tudo com Docker (API + banco)

```bash
docker compose up --build
```

A API sobe em `http://localhost:3000`. As migrations são aplicadas
automaticamente na inicialização.

**GitHub Codespaces:** neste ambiente a comunicação entre containers pela rede
interna do Docker fica bloqueada. Use o arquivo de ajuste, que faz a API usar a
rede do próprio Codespace:

```bash
docker compose -f docker-compose.yml -f docker-compose.codespaces.yml up --build
```

Para parar tudo (os dados do banco são mantidos):

```bash
docker compose down
```

Use `docker compose down -v` apenas se quiser apagar também o banco.

### Opção 2: API local + banco no Docker (desenvolvimento)

1. Configure as variáveis de ambiente:
```bash
   cp .env.example .env
```
2. Suba só o banco:
```bash
   docker compose up -d db
```
3. Instale as dependências:
```bash
   npm install
```
4. Gere o Prisma Client (a pasta `src/generated` não é versionada):
```bash
   npx prisma generate
```
5. Aplique as migrations:
```bash
   npx prisma migrate deploy
```
   Durante o desenvolvimento, ao alterar o `schema.prisma`, use
   `npx prisma migrate dev --name nome_da_mudanca`.
6. Rode a API com hot reload:
```bash
   npm run dev
```

Teste:

```bash
curl http://localhost:3000/api/health
```

## Scripts

| Script          | Descrição                                   |
|-----------------|---------------------------------------------|
| `npm run dev`   | Roda a API com hot reload (`tsx watch`)     |
| `npm run build` | Compila o TypeScript para a pasta `dist`    |
| `npm start`     | Roda a versão compilada (`dist/server.js`)  |

## Endpoints

Base: `/api`

| Método | Rota                | Descrição                                     |
|--------|---------------------|-----------------------------------------------|
| GET    | `/health`           | Verifica se a API está no ar                  |
| GET    | `/categorias`       | Lista categorias                              |
| GET    | `/categorias/:id`   | Detalha uma categoria                         |
| POST   | `/categorias`       | Cria categoria                                |
| PUT    | `/categorias/:id`   | Atualiza categoria                            |
| DELETE | `/categorias/:id`   | Remove categoria                              |
| GET    | `/fornecedores`     | Lista fornecedores                            |
| GET    | `/fornecedores/:id` | Detalha um fornecedor                         |
| POST   | `/fornecedores`     | Cria fornecedor                               |
| PUT    | `/fornecedores/:id` | Atualiza fornecedor                           |
| DELETE | `/fornecedores/:id` | Remove fornecedor                             |
| GET    | `/produtos`         | Lista produtos (com categoria e fornecedor)   |
| GET    | `/produtos/:id`     | Detalha um produto                            |
| POST   | `/produtos`         | Cria produto                                  |
| PUT    | `/produtos/:id`     | Atualiza produto (campos parciais)            |
| DELETE | `/produtos/:id`     | Remove produto                                |
| GET    | `/movimentacoes`    | Lista o histórico (filtro: `?produtoId=<id>`) |
| POST   | `/movimentacoes`    | Registra entrada ou saída de estoque          |

Movimentações não têm `PUT` nem `DELETE` de propósito: são um histórico. Um
lançamento errado deve ser compensado com uma nova movimentação.

### Exemplos

Criar um produto:

```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Mouse sem fio",
    "sku": "MOU-001",
    "precoCusto": 25.5,
    "precoVenda": 49.9,
    "quantidade": 10,
    "quantidadeMin": 5,
    "categoriaId": "ID_DA_CATEGORIA",
    "fornecedorId": "ID_DO_FORNECEDOR"
  }'
```

Registrar uma saída de estoque:

```bash
curl -X POST http://localhost:3000/api/movimentacoes \
  -H "Content-Type: application/json" \
  -d '{"produtoId": "ID_DO_PRODUTO", "tipo": "SAIDA", "quantidade": 3, "motivo": "Venda"}'
```

A movimentação atualiza a quantidade do produto e grava o histórico dentro de
uma transação: se qualquer parte falhar, nada é alterado. Em saídas, a
quantidade só é descontada se houver estoque suficiente.

Os preços são devolvidos como string (ex: `"25.5"`) porque o campo é `Decimal`
no banco, e o Prisma preserva a precisão dessa forma.

## Respostas de erro

Todos os erros são devolvidos em JSON, com o status HTTP adequado:

| Situação                                         | Status |
|--------------------------------------------------|--------|
| Dados inválidos (validação do Zod)               | 422    |
| Valor repetido em campo único (ex: `sku`)        | 409    |
| Referência a registro inexistente ou em uso      | 409    |
| Registro não encontrado (update/delete)          | 404    |
| Produto não encontrado ou estoque insuficiente   | 404/400|
| Rota inexistente                                 | 404    |
| JSON malformado                                  | 400    |
| Erro inesperado (detalhes só no log do servidor) | 500    |

## Estrutura do projeto

```
prisma/
  schema.prisma          # modelo do banco de dados
  migrations/            # histórico de migrations
src/
  config/                # instância do Prisma Client (com driver adapter)
  controllers/           # recebem a requisição, validam e respondem
  services/              # regras de negócio e acesso ao banco
  routes/                # definição das rotas do Express
  middlewares/           # tratamento de erros
  types/                 # schemas de validação (Zod)
  utils/                 # AppError
  generated/             # Prisma Client gerado (não versionado)
  app.ts                 # configuração do Express
  server.ts              # ponto de entrada
prisma.config.ts         # configuração da CLI do Prisma 7 (URL do banco)
Dockerfile               # build multi-stage da API
docker-compose.yml       # API + PostgreSQL
docker-compose.codespaces.yml  # ajuste para Codespaces
.env.example             # variáveis de ambiente de exemplo
```

Fluxo de uma requisição:

```
Rota  →  Controller  →  Service  →  Banco (Prisma)
                           ↓ erro
                  Middleware de erros → resposta JSON
```

## Notas técnicas

- **Prisma 7:** a URL do banco fica em `prisma.config.ts` (usada pela CLI) e a
  aplicação conecta pelo driver adapter `@prisma/adapter-pg`, em
  `src/config/prisma.ts`. O client é gerado em `src/generated/prisma` e
  importado de `../generated/prisma/client`.
- **TypeScript 7:** a opção `moduleResolution: "node"` foi removida. O
  `tsconfig.json` não a declara (com `module: CommonJS` o padrão já é o
  correto) e define `types: ["node"]` explicitamente.
- **Client gerado no Docker:** o `tsc` não copia os `.js` gerados pelo Prisma
  para o `dist`, então o `Dockerfile` faz `cp -r src/generated dist/generated`
  depois do build. O `prisma generate` roda antes do `npm run build`.
- **Nomes dos campos:** devem ser idênticos no `schema.prisma`, nos schemas do
  Zod e no JSON das requisições (por exemplo, `sku` e `categoriaId`).

## Próximos passos possíveis

- Paginação e filtros nas listagens
- Autenticação (JWT)
- Testes automatizados
- Endpoint de produtos com estoque abaixo do mínimo
