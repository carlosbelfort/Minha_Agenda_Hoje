# Minha Agenda Hoje – Fullstack Monorepo

O **Minha Agenda Hoje** é um sistema **fullstack de organização de tarefas e agendas diárias**, desenvolvido com arquitetura **monorepo**, focado em **produtividade**, **controle de acesso por perfil** e **experiência profissional de dashboard**.

O projeto foi estruturado para **evolução contínua**, **escalabilidade** e **deploy em ambientes serverless** como o Vercel.

---

## Objetivo do Projeto

Permitir que usuários possam:

- Criar, editar e gerenciar tarefas/agendas diárias
- Visualizar suas tarefas em um dashboard organizado
- Controlar acesso por perfil (**ADMIN** e **USER**)
- Utilizar uma interface moderna, responsiva e intuitiva
- Administradores podem gerenciar usuários do sistema

---

## Arquitetura Geral (Monorepo)

```txt
minha-agenda-hoje/
├── apps/
│   ├── web/            # Frontend Next.js (App Router)
│   └── api/            # Backend Node.js (Fastify)
│
├── packages/
│   ├── ui/             # Componentes reutilizáveis (shadcn/ui customizados)
│   ├── types/          # Tipos TypeScript compartilhados
│   └── config/         # ESLint, Prettier e Tailwind config
│
├── .github/
│   └── workflows/      # CI (lint e testes)
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
=======
```
---
# Tecnologias Utilizadas
 Monorepo
PNPM Workspaces

Turborepo

>>>>>>> 7a419e23f1e6d7fa04c37621c19ab2baf0b179ee
# Frontend — apps/web
- Next.js (App Router)

- TypeScript

- Tailwind CSS

- shadcn/ui

=======
- Lucide Icons
- React Hook Form
- Zod
- Context API (Autenticação)
- Layouts segmentados (Public / Dashboard)

# Backend — apps/api
- Node.js
- Fastify
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT (Autenticação)
- Controle de permissões por role (ADMIN / USER)

## Controle de Acesso
### Perfil	Permissões
USER	Criar e gerenciar suas próprias tarefas
ADMIN	Gerenciar usuários e acessar área administrativa

## Gerenciador de Pacotes
Este projeto utiliza PNPM.
```
>>>>>>> 7a419e23f1e6d7fa04c37621c19ab2baf0b179ee
npm install -g pnpm
⚙️ Configuração do Ambiente
1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/minha-agenda-hoje.git
cd minha-agenda-hoje
2️⃣ Instalar dependências
pnpm install
3️⃣ Configurar variáveis de ambiente
Backend (apps/api/.env)
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="sua_chave_secreta"
Frontend (apps/web/.env.local)
NEXT_PUBLIC_API_URL="http://localhost:3333"
4️⃣ Rodar as migrations do Prisma
cd apps/api
pnpm prisma migrate dev
5️⃣ Rodar o projeto em modo desenvolvimento
Na raiz do projeto:


## Configuração do Ambiente
1️⃣ Clonar o repositório
```
git clone https://github.com/seu-usuario/minha-agenda-hoje.git
cd minha-agenda-hoje
```

2️⃣ Instalar dependências
```
pnpm install
```
3️⃣ Configurar variáveis de ambiente
### Backend 
(apps/api/.env)
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="sua_chave_secreta"
```
### Frontend 
(apps/web/.env.local)
```
NEXT_PUBLIC_API_URL="http://localhost:3333"
```
4️⃣ Rodar as migrations do Prisma
cd apps/api
```
pnpm prisma migrate dev
```
5️⃣ Rodar o projeto em modo desenvolvimento
Na raiz do projeto:
```
pnpm dev
```
##### Frontend: http://localhost:3000
##### Backend: http://localhost:3333

### Estrutura das Aplicações
##### apps/web (Frontend)
- Páginas públicas:
- Página inicial
- Login
- Cadastro
- Dashboard autenticado
- Sidebar com navegação dinâmica
- Layout com background global e UI profissional
- Componentes reutilizáveis baseados em shadcn/ui

##### apps/api (Backend)
- Autenticação com JWT
- CRUD de usuários
- CRUD de agendas/tarefas
- Middleware de autenticação
- Middleware de autorização por role
---
# Testes Backend (API)

Os testes automatizados garantem o funcionamento básico das principais funcionalidades da API, como autenticação e criação de agendas.
O projeto utiliza Vitest como framework de testes.

## Estrutura de Testes

Os testes do backend estão localizados na pasta:

- apps/api/tests

Estrutura atual:
```
tests/
├── auth.spec.ts        # Testes de autenticação (login)
├── agenda.spec.ts      # Testes de criação de agenda
└── helpers/
    └── createTestUser.ts  # Helper para criação de usuário de teste
```
### Pré-requisitos

##### Antes de rodar os testes, certifique-se de que:

- Node.js esteja instalado

- PNPM esteja instalado

- Dependências do projeto estejam instaladas

- Banco de dados configurado corretamente (local ou de teste)

##### Instale as dependências:
```
pnpm install
```
##### Executando os Testes

Acesse a pasta da API:

- cd apps/api


Execute os testes com o comando:
```
pnpm test
```

O Vitest será iniciado em modo watch, reexecutando os testes automaticamente a cada alteração nos arquivos.

### Resultado Esperado

Quando tudo estiver configurado corretamente, o resultado será semelhante a:

✓ tests/auth.spec.ts
✓ tests/agenda.spec.ts

### Observações Importantes

Cada arquivo de teste é isolado

Usuários de teste são criados automaticamente antes da execução dos testes

A autenticação é feita via JWT, simulando o fluxo real da aplicação

As rotas protegidas exigem o envio do token no header:

Authorization: Bearer <token>

### Boas Práticas Adotadas

- Setup e teardown do servidor com beforeAll e afterAll

- Criação de helpers reutilizáveis para dados de teste

- Testes independentes e determinísticos

- Uso de app.inject() para evitar subir servidor real

---
# Testes de Frontend (Web)

Os testes de frontend garantem que as principais telas e interações da aplicação estejam funcionando corretamente.

###  Tecnologias utilizadas

- **Vitest** — Runner de testes
- **@testing-library/react** — Testes de componentes React
- **@testing-library/jest-dom** — Matchers adicionais para o DOM
- **jsdom** — Ambiente de simulação do navegador
- **Next.js (App Router)** — Framework frontend

---

### Estrutura de testes

Os testes do frontend ficam localizados em:

```
apps/web/tests/
```

- Exemplo:
```
tests/
├── pages.spec.tsx    # Testes de renderização de páginas
└── forms.spec.tsx    # Testes de validação e interação com formulários
```
### Como rodar os testes

- Acesse a pasta do frontend:
```
cd apps/web
```

- Execute os testes:
```
pnpm test
```

Ou, se estiver usando npm:
```
npm run test
```
#### Rodar em modo watch (desenvolvimento)

Durante o desenvolvimento, os testes rodam automaticamente ao salvar arquivos:
```
pnpm test
```

Pressione:
```
h → ajuda

q → sair do modo watch
```
##### O que é testado atualmente
- Páginas

Renderização da página de login

- Formulários

Interação com o botão de envio

Comportamento do formulário ao ser submetido vazio

###### Observação: a validação visual de erros depende da implementação no componente.
Caso não exista mensagem de erro no DOM, o teste deve refletir o comportamento atual da tela.

###### Configurações importantes

Arquivo de configuração do Vitest:

- vitest.config.ts

Setup global de testes:

- setupTests.ts


Esses arquivos garantem:

- Suporte a expect

- Matchers do jest-dom

- Ambiente jsdom

- Compatibilidade com o App Router do Next.js

---

## Deploy
>>>>>>> 7a419e23f1e6d7fa04c37621c19ab2baf0b179ee
Projeto preparado para deploy no Vercel

Frontend e backend podem ser deployados separadamente

Prisma compatível com ambientes serverless

Variáveis de ambiente configuradas via painel do Vercel


=======
## Status do Projeto
>>>>>>> 7a419e23f1e6d7fa04c37621c19ab2baf0b179ee
✅ Funcional
⚙️ Em evolução contínua
🚀 Estrutura profissional pronta para produção


=======
## 👨‍💻 Autor
#### Desenvolvido por Mateus Belfort
>>>>>>> 7a419e23f1e6d7fa04c37621c19ab2baf0b179ee

