# 🚀 nuxt-nest-starter

<div align="center">

**Professional scaffolding for vibe coding with Claude Code**

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
# Option 1: interactive CLI
npx nuxt-nest-starter

# Option 2: direct
npx nuxt-nest-starter create my-project --template nuxt-nest-fullstack

# Option 3: list available templates
npx nuxt-nest-starter list
```

The CLI asks for the name, the template, and in 30 seconds you have a project ready with git initialized and dependencies installed.

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

**Includes:** full CRUD example module, global error filter, logging and transform interceptors, Zod DTOs.

---

### `nuxt-nest-fullstack` — Full monorepo

Frontend + Backend in a single repo with shared types.

```bash
npx nuxt-nest-starter create my-fullstack --template nuxt-nest-fullstack
cd my-fullstack && pnpm dev
# → frontend: http://localhost:3000
# → backend:  http://localhost:3001/api/docs
```

**Includes everything above plus:** pnpm workspace, shared types in `packages/shared`, Nuxt proxy pointing to NestJS, dev scripts that start both services.

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
- Follow exactly the architecture of the existing example/ module
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
├── cli/                          # CLI to generate projects
│   └── src/
│       ├── commands/create.ts    # Main logic
│       ├── utils/helpers.ts      # Utilities
│       └── types/index.ts        # CLI types
├── templates/
│   ├── nuxt-app/                 # Nuxt 3 template
│   │   ├── CLAUDE.md             # ← The most important file
│   │   ├── nuxt.config.ts
│   │   ├── components/ui/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types/
│   ├── nest-api/                 # NestJS template
│   │   ├── CLAUDE.md             # ← The most important file
│   │   ├── src/
│   │   │   ├── common/           # Filters, guards, interceptors
│   │   │   ├── config/           # TypeORM, JWT config
│   │   │   └── modules/example/  # Example CRUD
│   │   └── tsconfig.json
│   └── nuxt-nest-fullstack/      # Monorepo template
│       ├── CLAUDE.md
│       ├── frontend/
│       └── backend/
└── docs/
    └── prompts.md                # More ready-to-use prompts
```

---

## 🤝 Contributing

Got a template, a better CLAUDE.md, or more prompts? PRs are welcome!

```bash
# 1. Fork + clone
git clone https://github.com/your-username/nuxt-nest-starter
cd nuxt-nest-starter

# 2. Create your template
cp -r templates/nuxt-app templates/my-template
# Edit CLAUDE.md and the files

# 3. Test that the CLI generates it correctly
node cli/dist/index.js create test-project --template my-template

# 4. PR with a description of what problem it solves
```

**Template ideas that are missing:**
- [ ] `nuxt-content` — Blog/docs with Nuxt Content
- [ ] `nest-graphql` — NestJS + GraphQL + Prisma
- [ ] `nuxt-electron` — Desktop app with Nuxt + Electron
- [ ] `nest-microservices` — Microservices with NATS
- [ ] `nest-websockets` — Real-time with WebSockets

---

## 📄 License

MIT © {{YEAR}} — Made with ☕ and vibe coding.

---

<div align="center">
If this saves you time, give the repo a ⭐ — it helps more people find it.
</div>
