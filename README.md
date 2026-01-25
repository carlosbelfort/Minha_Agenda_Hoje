# 🗂️ Minha Agenda Hoje – Monorepo

Este repositório contém a **estrutura inicial oficial** do projeto **Minha Agenda Hoje**, um sistema fullstack para organização de agenda diária, preparado para **evoluir**, **escalar** e realizar **deploy no Vercel**.

---

## 🎯 Objetivo do Projeto

Criar um sistema online onde usuários possam:
- Criar e gerenciar agendamentos diários
- Anexar fotos aos agendamentos
- Ter controle de acesso por perfil (ADMIN / USER)

O projeto utiliza **monorepo** para compartilhar código, tipos e configurações entre frontend e backend.

---

## 🧱 Arquitetura Geral

```txt
minha-agenda-hoje/
├── apps/
│   ├── web/            # Frontend Next.js (App Router)
│   └── api/            # Backend Node.js (Fastify)
│
├── packages/
│   ├── ui/             # Componentes compartilhados (shadcn/ui customizados)
│   ├── types/          # Tipos TypeScript compartilhados
│   └── config/         # Configurações ESLint, Prettier, Tailwind
│
├── .github/
│   └── workflows/      # CI (lint + testes)
│
├── .editorconfig
├── .gitignore
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

---

## 🧰 Tecnologias Utilizadas

### Monorepo
- **PNPM Workspaces**
- **Turborepo**

### Frontend (apps/web)
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod

### Backend (apps/api)
- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL (Neon ou Supabase)
- Cloudinary (upload de imagens)
- JWT (autenticação)

---

## 📦 Gerenciador de Pacotes

Este projeto utiliza **PNPM**.

```bash
npm install -g pnpm
```

---

## 📁 Configuração dos Workspaces

### pnpm-workspace.yaml

```yaml
packages:
  - "apps/*"
  - "packages/*"
```

---

## ⚙️ Turborepo

### turbo.json

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "dev": {
      "cache": false
    },
    "build": {
      "dependsOn": ["^build"],
      "outputs": [".next/**", "dist/**"]
    },
    "lint": {},
    "test": {}
  }
}
```

---

## 📄 package.json (raiz)

```json
{
  "name": "minha-agenda-hoje",
  "private": true,
  "packageManager": "pnpm@9.0.0",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test"
  },
  "devDependencies": {
    "turbo": "^2.0.0"
  }
}
```

---

## 🧩 Packages Compartilhados

### packages/types

- Tipos compartilhados entre frontend e backend
- Exemplo: User, Agenda, Role

```ts
export type Role = "ADMIN" | "USER";
```

---

### packages/ui

- Componentes base derivados do shadcn/ui
- Botões, Inputs, Cards, Modals
- Totalmente estilizados com Tailwind

---

### packages/config

- ESLint config
- Prettier config
- Tailwind preset com paleta do projeto

Paleta:
- #171133
- #581e44
- #c5485a
- #d4be99
- #e0ffcc

---

## 🌐 Apps

### apps/web

Responsável pela interface do usuário.

Estrutura inicial:

```txt
apps/web/
├── app/
│   ├── (public)/
│   │   ├── page.tsx        # Tela inicial
│   │   ├── login/page.tsx  # Login
│   │   └── register/
│   ├── dashboard/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
├── lib/
├── styles/
├── tests/
└── package.json
```

---

### apps/api

Responsável pela API REST.

Estrutura inicial:

```txt
apps/api/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   ├── users/
│   │   └── agendas/
│   ├── lib/
│   │   ├── prisma.ts
│   │   └── cloudinary.ts
│   ├── middlewares/
│   │   ├── auth.ts
│   │   └── role.ts
│   ├── routes.ts
│   └── server.ts
├── prisma/
│   └── schema.prisma
├── tests/
└── package.json
```

---

## 🧪 Testes

- Backend: Vitest
- Frontend: Vitest + Testing Library

Mínimo:
- Login
- Criação de agenda
- Renderização de tela

---

## 🚀 Deploy no Vercel

- Frontend e backend deployados separadamente
- Variáveis de ambiente configuradas no Vercel
- Prisma compatível com serverless
- Cloudinary configurado via ENV

---

## 📌 Próximos Passos

1. Inicializar apps/web com Next.js
2. Inicializar apps/api com Fastify
3. Configurar Prisma + banco
4. Implementar autenticação

---

## 🏁 Status

📦 Estrutura criada
⚙️ Pronta para evolução
🚀 Compatível com Vercel

ordem de criação:

1️⃣ Inicializar apps/web com Next.js + Tailwind + shadcn/ui
2️⃣ Inicializar apps/api com Fastify + Prisma
3️⃣ Configurar Prisma + banco PostgreSQL
4️⃣ Implementar Auth (JWT + Roles)
5️⃣ Criar primeiros endpoints reais
6️⃣ Conectar frontend ↔ backend
7️⃣ Testes
8️⃣ Deploy



