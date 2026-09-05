# Estoque Backend

API REST para gerenciamento de estoque (produtos, categorias, fornecedores e
movimentações). Projeto em construção, feito como estudo de backend com
Node.js + TypeScript + Prisma + Docker.

> ⚠️ Projeto em andamento — este README reflete o progresso até o momento.

## Stack

- Node.js + TypeScript
- Express
- Prisma ORM 7 (com driver adapter `@prisma/adapter-pg`) + PostgreSQL
- Docker / Docker Compose

## Status atual

- [x] Projeto Node.js + TypeScript configurado
- [x] Servidor Express básico rodando (`/api/health`)
- [x] PostgreSQL rodando via Docker Compose
- [x] Prisma configurado e conectado ao banco
- [ ] Models (Categoria, Fornecedor, Produto, Movimentação)
- [ ] CRUD das entidades
- [ ] Regras de movimentação de estoque
- [ ] Tratamento de erros centralizado
- [ ] API containerizada com Docker

## Pré-requisitos

- Node.js 20+
- Docker Desktop (com WSL2 habilitado, no Windows)

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/SEU_USUARIO/estoque-backend.git
cd estoque-backend
```

### 2. Configure as variáveis de ambiente

Copie o `.env.example` para `.env`:

```bash
cp .env.example .env
```

### 3. Suba o banco de dados

```bash
docker compose up db -d
```

Confirme que subiu:

```bash
docker ps
```

Você deve ver o container `estoque_db` com status `Up`.

### 4. Instale as dependências

```bash
npm install
```

### 5. Gere o Prisma Client

```bash
npx prisma generate
```

### 6. Rode o servidor em modo desenvolvimento

```bash
npm run dev
```

A API sobe em `http://localhost:3000`. Teste com:

```bash
curl http://localhost:3000/api/health
```

Deve retornar `{"status":"ok"}`.

## Estrutura do projeto (até agora)
