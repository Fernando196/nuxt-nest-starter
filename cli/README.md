# nuxt-nest-starter

> CLI to scaffold production-ready NestJS and Nuxt 3 projects in seconds — pre-configured for vibe coding with Claude Code.

[![npm version](https://img.shields.io/npm/v/nuxt-nest-starter.svg)](https://www.npmjs.com/package/nuxt-nest-starter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](../LICENSE)

## Usage

No installation required:

```bash
npx nuxt-nest-starter
```

Or install globally:

```bash
npm install -g nuxt-nest-starter
nuxt-nest-starter
```

---

## Commands

### `create` (default)

Scaffolds a new project from a template.

```bash
nuxt-nest-starter create [project-name] [options]
```

If you omit the project name or `--template`, the CLI will prompt you interactively.

**Options:**

| Flag | Description |
|---|---|
| `-t, --template <name>` | Template to use (see templates below) |
| `--skip-install` | Skip dependency installation |
| `--skip-git` | Skip git initialization |

**Examples:**

```bash
# Interactive — prompts for name and template
npx nuxt-nest-starter

# Direct — no prompts
npx nuxt-nest-starter create my-api --template nest-api

# Skip install and git
npx nuxt-nest-starter create my-api --template nest-api --skip-install --skip-git
```

---

### `list`

Lists all available templates.

```bash
npx nuxt-nest-starter list
```

---

## Templates

### `nest-api`

REST API with NestJS + MySQL, ready to extend.

- NestJS 10 + TypeScript strict
- TypeORM + MySQL (`mysql2`)
- Zod validation (via `nestjs-zod`) — no `class-validator`
- Swagger/OpenAPI auto-docs at `/api/docs`
- JWT + Passport auth wiring
- Global exception filter, logging and transform interceptors
- `ZodValidationPipe` registered globally
- Users module as reference (CRUD + pagination + soft delete)
- `npm run db:create` — creates the MySQL database
- `npm run schema:sync` — syncs tables from entities

```bash
npx nuxt-nest-starter create my-api --template nest-api
cd my-api
cp .env.example .env   # set your DB credentials
npm run db:create
npm run start:dev
# → http://localhost:3001/api/docs
```

---

### `nuxt-app`

Full-featured Nuxt 3 frontend.

- Nuxt 3 + TypeScript strict
- Pinia for global state
- TailwindCSS v4
- VeeValidate + Zod for forms
- Typed `useApi` composable
- Auth store wired up
- Vitest for unit tests

```bash
npx nuxt-nest-starter create my-app --template nuxt-app
cd my-app
npm run dev
# → http://localhost:3000
```

---

### `nuxt-nest-fullstack`

Monorepo with Nuxt 3 frontend + NestJS backend + shared types.

- pnpm workspace
- Shared types in `packages/shared`
- Nuxt proxy pointing to NestJS
- Single `npm run dev` starts both services

```bash
npx nuxt-nest-starter create my-app --template nuxt-nest-fullstack
cd my-app
npm run dev
# → frontend: http://localhost:3000
# → backend:  http://localhost:3001/api/docs
```

---

## What the CLI does

When you run `create`, the CLI:

1. Validates the project name (kebab-case)
2. Copies the template files (excludes `node_modules`, `.nuxt`, `dist`)
3. Replaces template variables: `{{PROJECT_NAME}}`, `{{PROJECT_NAME_PASCAL}}`, `{{YEAR}}`
4. Renames `_gitignore` → `.gitignore`
5. Runs `git init` + initial commit (unless `--skip-git`)
6. Runs `pnpm install` (unless `--skip-install`)

---

## Claude Code integration

Every generated project includes a `CLAUDE.md` file with precise instructions for Claude Code — architecture rules, patterns to follow, and things to avoid. Open the project and run `claude` to start building immediately.

---

## License

MIT
