# Gerenciador de Estoque - Backend

API REST para gerenciamento de estoque (produtos, categorias, fornecedores e
movimentações). Projeto em construção, feito como estudo de backend com
Node.js, TypeScript, Prisma e Docker.

> ⚠️ Projeto em andamento. Este README reflete o progresso até o momento.

## Stack

- Node.js 20+ e TypeScript
- Express
- Prisma ORM 7 com driver adapter (`@prisma/adapter-pg`) e PostgreSQL
- Zod (validação dos dados de entrada)
- Docker / Docker Compose (banco de dados)

## Status atual

- [x] Projeto Node.js + TypeScript configurado
- [x] Servidor Express com rota de health check
- [x] PostgreSQL rodando via Docker Compose
- [x] Prisma 7 configurado (driver adapter + client gerado em `src/generated`)
- [x] Models: Categoria, Fornecedor, Produto e Movimentação
- [x] CRUD de Categoria
- [x] CRUD de Fornecedor
- [x] CRUD de Produto (com categoria e fornecedor incluídos na resposta)
- [ ] Movimentações de estoque (entrada/saída com transação)
- [ ] Tratamento de erros centralizado
- [ ] API containerizada com Docker

## Pré-requisitos

- Node.js 20+
- Docker (no Windows, Docker Desktop com WSL2 habilitado)

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/yurysmaciel/GerenciadorDeEstoque-BackEnd.git
cd GerenciadorDeEstoque-BackEnd
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

O `.env.example` já vem com as credenciais do `docker-compose.yml`, então não
precisa alterar nada para rodar localmente.

### 3. Suba o banco de dados

```bash
docker compose up db -d
```

Confirme que o container `estoque_db` está com status `Up`:

```bash
docker ps
```

### 4. Instale as dependências

```bash
npm install
```

### 5. Gere o Prisma Client

O client é gerado em `src/generated/prisma`, pasta que não vai para o Git. Por
isso este passo é necessário depois de clonar o projeto:

```bash
npx prisma generate
```

### 6. Crie as tabelas no banco

Em um banco novo e vazio, aplique as migrations que já estão no repositório:

```bash
npx prisma migrate deploy
```

Se estiver desenvolvendo e alterando o `schema.prisma`, use no lugar:

```bash
npx prisma migrate dev --name nome_da_mudanca
```

### 7. Rode a API em modo desenvolvimento

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. Teste com:

```bash
curl http://localhost:3000/api/health
```

Resposta esperada: `{"status":"ok"}`.

## Scripts disponíveis

| Script          | Descrição                                      |
|-----------------|------------------------------------------------|
| `npm run dev`   | Roda a API com hot reload (via `tsx watch`)    |
| `npm run build` | Compila o TypeScript para a pasta `dist`       |
| `npm start`     | Roda a versão compilada (`dist/server.js`)     |

## Endpoints

Base: `/api`

| Método | Rota                | Descrição                         |
|--------|---------------------|-----------------------------------|
| GET    | `/health`           | Verifica se a API está no ar      |
| GET    | `/categorias`       | Lista categorias                  |
| GET    | `/categorias/:id`   | Detalha uma categoria             |
| POST   | `/categorias`       | Cria categoria                    |
| PUT    | `/categorias/:id`   | Atualiza categoria                |
| DELETE | `/categorias/:id`   | Remove categoria                  |
| GET    | `/fornecedores`     | Lista fornecedores                |
| GET    | `/fornecedores/:id` | Detalha um fornecedor             |
| POST   | `/fornecedores`     | Cria fornecedor                   |
| PUT    | `/fornecedores/:id` | Atualiza fornecedor               |
| DELETE | `/fornecedores/:id` | Remove fornecedor                 |
| GET    | `/produtos`         | Lista produtos (com categoria e fornecedor) |
| GET    | `/produtos/:id`     | Detalha um produto                |
| POST   | `/produtos`         | Cria produto                      |
| PUT    | `/produtos/:id`     | Atualiza produto (campos parciais)|
| DELETE | `/produtos/:id`     | Remove produto                    |

### Exemplos

Criar uma categoria:

```bash
curl -X POST http://localhost:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nome": "Eletronicos"}'
```

Criar um produto (use os ids reais de uma categoria e de um fornecedor):

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

Os preços são devolvidos como string (ex: `"25.5"`) porque o campo é `Decimal`
no banco e o Prisma preserva a precisão dessa forma.

## Estrutura do projeto

```
prisma/
  schema.prisma        # modelo do banco de dados
  migrations/          # histórico de migrations
src/
  config/              # instância do Prisma Client (com driver adapter)
  controllers/         # recebem a requisição, validam e respondem
  services/            # regras de negócio e acesso