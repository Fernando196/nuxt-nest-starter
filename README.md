# 🚀 nuxt-nest-starter

<div align="center">

**Professional scaffolding for vibe coding with Claude Code**

[![npm version](https://img.shields.io/npm/v/nuxt-nest-starter?color=crimson)](https://www.npmjs.com/package/nuxt-nest-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com)

*Spending more time configuring than building? This repo fixes that.*

[🚀 Quick start](#-quick-start) · [📦 Templates](#-templates) · [🤖 Prompts](#-vibe-coding-prompts) · [🤝 Contributing](#-contributing)

</div>

---

## What is this?

**nuxt-nest-starter** gives you complete, ready-to-go projects so you can run `claude` and start building in seconds — no TypeScript setup, no fighting with the linter, no hunting down how to integrate Pinia with Zod.

Each template includes:
- ✅ **CLAUDE.md** with precise instructions for Claude Code
- ✅ **Strict TypeScript** configured to the max (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- ✅ **Folder structure** with production-proven architecture
- ✅ **Automatic setup scripts** (git, install, env)
- ✅ **Prompt examples** to start vibe coding immediately

---

## 🚀 Quick start

```bash
# Option 1: interactive (recommended)
npx nuxt-nest-starter

# Option 2: direct
npx nuxt-nest-starter create my-project --template nuxt-nest-fullstack

# Option 3: list available templates
npx nuxt-nest-starter list
```

The CLI asks for the name and the template. In under a minute you have a project ready with git initialized and dependencies installed.

---

## 📦 Templates

### `nuxt-app` — Frontend with Nuxt 3

For full web apps with SSR, SSG, or SPA.

| Technology | Version | Purpose |
|---|---|---|
| Nuxt 3 | ^3.14 | Framework |
| TypeScript | strict | Typing |
| Pinia | ^2.2 | Global state |
| TailwindCSS | v4 | Styling |
| VeeValidate + Zod | ^4.13 | Forms |
| Vitest | ^2.1 | Tests |

```bash
npx nuxt-nest-starter create my-app --template nuxt-app
cd my-app && pnpm dev
# → http://localhost:3000
```

**Includes:** typed `useApi` composable, Pinia auth store, global types, page structure with layouts.

---

### `nest-api` — REST API with NestJS

For robust backends with PostgreSQL.

| Technology | Version | Purpose |
|---|---|---|
| NestJS | ^10.4 | Framework |
| TypeScript | strict | Typing |
| TypeORM | ^0.3 | ORM |
| Zod + nestjs-zod | ^3 | Validation |
| Swagger/OpenAPI | ^7.4 | Auto docs |
| JWT + Passport | — | Auth |
| Jest | ^29 | Tests |

```bash
npx nuxt-nest-starter create my-api --template nest-api
cd my-api && cp .env.example .env && pnpm start:dev
# → http://localhost:3001/api/docs
```

**Includes:** full CRUD example module (users), global error filter, logging and transform interceptors, Zod DTOs.

---

### `nuxt-nest-fullstack` — Full monorepo

Frontend + Backend in a single repo. The CLI copies the `nuxt-app` template into `frontend/` and the `nest-api` template into `backend/`.

```bash
npx nuxt-nest-starter create my-fullstack --template nuxt-nest-fullstack
```

Then start each service in a separate terminal:

```bash
# Backend
cd my-fullstack/backend && pnpm start:dev
# → http://localhost:3001/api/docs

# Frontend
cd my-fullstack/frontend && pnpm dev
# → http://localhost:3000
```

**Includes everything from both templates above**, organized as:

```
my-fullstack/
├── backend/   → NestJS API
└── frontend/  → Nuxt 3 App
```

---

## 🤖 Vibe coding prompts

Prompts are designed to work with the `CLAUDE.md` included in each template. Claude Code already has full project context.

### For `nuxt-app`

```
Create a complete authentication module:
- /login page with a form validated with VeeValidate + Zod
- /register page with password validation
- Auth middleware to protect private routes
- The authStore already exists at stores/auth.store.ts, use it
- Components go in components/ui/, the form in components/forms/
```

```
Add a paginated product list:
- /products page with table + search + filters
- useProducts composable using the existing useApi
- Skeleton loading while fetching
- Strict TypeScript, no any
```

```
Create a reusable UIDataTable component:
- TypeScript-typed props: columns, data, loading, pagination
- Emit events: sort, page-change, row-click
- Slots to customize each cell
- Goes in components/ui/DataTable.vue
```

### For `nest-api`

```
Create a complete Products module:
- Product entity with TypeORM (name, price, stock, category, soft delete)
- Zod DTOs: CreateProductDto, UpdateProductDto, ProductQueryDto
- Service with full CRUD and pagination
- REST controller with Swagger on all endpoints
- Follow exactly the architecture of the existing users/ module
```

```
Implement JWT authentication:
- AuthModule with login and register
- Passport JWT strategy
- @CurrentUser() decorator to get the authenticated user
- JwtAuthGuard applied at the controller level
- Password hashing with bcryptjs
```

```
Add rate limiting to the auth module:
- @nestjs/throttler configured in AppModule
- 5 attempts per minute on /auth/login
- Clear response to the client when the limit is exceeded
```

---

## 📁 Repo structure

```
nuxt-nest-starter/
├── cli/                          # CLI source code
│   └── src/
│       ├── commands/create.ts    # Main scaffolding logic
│       ├── utils/helpers.ts      # Template resolution & file utilities
│       └── types/index.ts        # Template definitions
├── templates/
│   ├── nuxt-app/                 # Nuxt 3 template
│   │   ├── CLAUDE.md             # ← The most important file
│   │   ├── nuxt.config.ts
│   │   ├── components/ui/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types/
│   └── nest-api/                 # NestJS template
│       ├── CLAUDE.md             # ← The most important file
│       ├── src/
│       │   ├── common/           # Filters, guards, interceptors
│       │   ├── config/           # TypeORM config
│       │   └── modules/users/    # Example CRUD module
│       └── tsconfig.json
└── docs/
    └── prompts.md                # More ready-to-use prompts
```

> The `nuxt-nest-fullstack` template is generated dynamically by the CLI — it combines `nest-api` and `nuxt-app` at runtime, so it has no dedicated folder.

---

## 🤝 Contributing

Got a template, a better CLAUDE.md, or more prompts? PRs are welcome!

```bash
# 1. Fork + clone
git clone https://github.com/Fernando196/nuxt-nest-starter
cd nuxt-nest-starter

# 2. Install and build the CLI
npm install

# 3. Create your template
cp -r templates/nuxt-app templates/my-template
# Edit CLAUDE.md and the files

# 4. Register it in cli/src/types/index.ts (add to the TEMPLATES object)

# 5. Build and test
npm run build
node cli/dist/index.js create test-project --template my-template

# 6. PR with a description of what problem it solves
```

**Template ideas that are missing:**
- [ ] `nuxt-content` — Blog/docs with Nuxt Content
- [ ] `nest-graphql` — NestJS + GraphQL + Prisma
- [ ] `nuxt-electron` — Desktop app with Nuxt + Electron
- [ ] `nest-microservices` — Microservices with NATS
- [ ] `nest-websockets` — Real-time with WebSockets

---

## 📄 License

MIT © 2026 — Made with ☕ and vibe coding.

---

<div align="center">
If this saves you time, give the repo a ⭐ — it helps more people find it.
</div>
