# 🚀 nuxt-nest-starter

<div align="center">

**Scaffolding profesional para vibe coding con Claude Code**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Nuxt 3](https://img.shields.io/badge/Nuxt-3-00DC82?logo=nuxt.js)](https://nuxt.com)
[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?logo=nestjs)](https://nestjs.com)

*¿Pasas más tiempo configurando que construyendo? Este repo lo resuelve.*

[🚀 Inicio rápido](#-inicio-rápido) · [📦 Templates](#-templates) · [🤖 Prompts](#-prompts-para-vibe-coding) · [🤝 Contribuir](#-contribuir)

</div>

---

## ¿Qué es esto?

**nuxt-nest-starter** te da proyectos completos y listos para que le des `claude` y empieces a construir en segundos — sin configurar TypeScript, sin pelear con el linter, sin buscar cómo integrar Pinia con Zod.

Cada template incluye:
- ✅ **CLAUDE.md** con instrucciones precisas para Claude Code
- ✅ **TypeScript strict** configurado al máximo (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)  
- ✅ **Estructura de carpetas** con arquitectura probada en producción
- ✅ **Scripts de setup** automático (git, install, env)
- ✅ **Ejemplos de prompts** para arrancar el vibe coding inmediatamente

---

## 🚀 Inicio rápido

```bash
# Opción 1: CLI interactivo
npx nuxt-nest-starter

# Opción 2: directo
npx nuxt-nest-starter create mi-proyecto --template nuxt-nest-fullstack

# Opción 3: ver templates disponibles
npx nuxt-nest-starter list
```

El CLI te pregunta el nombre, el template, y en 30 segundos tienes un proyecto listo con git inicializado y dependencias instaladas.

---

## 📦 Templates

### `nuxt-app` — Frontend con Nuxt 3

Para apps web completas con SSR, SSG o SPA.

| Tecnología | Versión | Para qué |
|---|---|---|
| Nuxt 3 | ^3.14 | Framework |
| TypeScript | strict | Tipado |
| Pinia | ^2.2 | Estado global |
| TailwindCSS | v4 | Estilos |
| VeeValidate + Zod | ^4.13 | Formularios |
| Vitest | ^2.1 | Tests |

```bash
npx nuxt-nest-starter create mi-app --template nuxt-app
cd mi-app && pnpm dev
# → http://localhost:3000
```

**Incluye:** composable `useApi` tipado, auth store con Pinia, tipos globales, estructura de páginas con layouts.

---

### `nest-api` — API REST con NestJS

Para backends robustos con PostgreSQL.

| Tecnología | Versión | Para qué |
|---|---|---|
| NestJS | ^10.4 | Framework |
| TypeScript | strict | Tipado |
| TypeORM | ^0.3 | ORM |
| Zod + nestjs-zod | ^3 | Validación |
| Swagger/OpenAPI | ^7.4 | Docs automáticas |
| JWT + Passport | — | Auth |
| Jest | ^29 | Tests |

```bash
npx nuxt-nest-starter create mi-api --template nest-api
cd mi-api && cp .env.example .env && pnpm start:dev
# → http://localhost:3001/api/docs
```

**Incluye:** módulo de ejemplo CRUD completo, filtro global de errores, interceptores de logging y transform, DTOs con Zod.

---

### `nuxt-nest-fullstack` — Monorepo completo

Frontend + Backend en un solo repo con tipos compartidos.

```bash
npx nuxt-nest-starter create mi-fullstack --template nuxt-nest-fullstack
cd mi-fullstack && pnpm dev
# → frontend: http://localhost:3000
# → backend:  http://localhost:3001/api/docs
```

**Incluye todo lo anterior más:** workspace de pnpm, tipos compartidos en `packages/shared`, proxy de Nuxt apuntando al NestJS, scripts de dev que levantan ambos servicios.

---

## 🤖 Prompts para vibe coding

Los prompts están diseñados para funcionar con el `CLAUDE.md` incluido en cada template. Claude Code ya tiene todo el contexto del proyecto.

### Para `nuxt-app`

```
Crea un módulo completo de autenticación:
- Página /login con formulario validado con VeeValidate + Zod
- Página /register con validación de contraseña
- Middleware de auth que proteja las rutas privadas
- El authStore ya existe en stores/auth.store.ts, úsalo
- Los componentes van en components/ui/, el formulario en components/forms/
```

```
Agrega una lista paginada de productos:
- Página /products con tabla + búsqueda + filtros
- Composable useProducts que use el useApi existente
- Skeleton loading mientras carga
- TypeScript strict, sin ningún any
```

```
Crea un componente UIDataTable reutilizable:
- Props tipadas con TypeScript: columns, data, loading, pagination
- Emit de eventos: sort, page-change, row-click
- Slots para personalizar cada celda
- Va en components/ui/DataTable.vue
```

### Para `nest-api`

```
Crea un módulo completo de Products:
- Entidad Product con TypeORM (nombre, precio, stock, categoría, soft delete)
- DTOs con Zod: CreateProductDto, UpdateProductDto, ProductQueryDto
- Servicio con CRUD completo y paginación
- Controlador REST con Swagger en todos los endpoints
- Sigue exactamente la arquitectura del módulo example/ que ya existe
```

```
Implementa autenticación JWT:
- Módulo AuthModule con login y register
- Estrategia Passport JWT
- Decorator @CurrentUser() para obtener el usuario autenticado
- Guard JwtAuthGuard aplicado a nivel de controlador
- Hash de contraseñas con bcryptjs
```

```
Agrega rate limiting al módulo de auth:
- @nestjs/throttler configurado en AppModule
- 5 intentos por minuto en /auth/login
- Respuesta clara al cliente cuando supera el límite
```

---

## 📁 Estructura del repo

```
nuxt-nest-starter/
├── cli/                          # CLI para generar proyectos
│   └── src/
│       ├── commands/create.ts    # Lógica principal
│       ├── utils/helpers.ts      # Utilidades
│       └── types/index.ts        # Tipos del CLI
├── templates/
│   ├── nuxt-app/                 # Template Nuxt 3
│   │   ├── CLAUDE.md             # ← El archivo más importante
│   │   ├── nuxt.config.ts
│   │   ├── components/ui/
│   │   ├── composables/
│   │   ├── stores/
│   │   └── types/
│   ├── nest-api/                 # Template NestJS
│   │   ├── CLAUDE.md             # ← El archivo más importante
│   │   ├── src/
│   │   │   ├── common/           # Filters, guards, interceptors
│   │   │   ├── config/           # TypeORM, JWT config
│   │   │   └── modules/example/  # CRUD de ejemplo
│   │   └── tsconfig.json
│   └── nuxt-nest-fullstack/      # Template monorepo
│       ├── CLAUDE.md
│       ├── frontend/
│       └── backend/
└── docs/
    └── prompts.md                # Más prompts listos para usar
```

---

## 🤝 Contribuir

¿Tienes un template, un CLAUDE.md mejor, o más prompts? ¡Los PRs son bienvenidos!

```bash
# 1. Fork + clone
git clone https://github.com/tu-usuario/nuxt-nest-starter
cd nuxt-nest-starter

# 2. Crea tu template
cp -r templates/nuxt-app templates/mi-template
# Edita el CLAUDE.md y los archivos

# 3. Prueba que el CLI lo genera bien
node cli/dist/index.js create test-project --template mi-template

# 4. PR con descripción de qué problema resuelve
```

**Ideas de templates que faltan:**
- [ ] `nuxt-content` — Blog/docs con Nuxt Content
- [ ] `nest-graphql` — NestJS + GraphQL + Prisma
- [ ] `nuxt-electron` — App desktop con Nuxt + Electron
- [ ] `nest-microservices` — Microservicios con NATS
- [ ] `nest-websockets` — Real-time con WebSockets

---

## 📄 Licencia

MIT © {{YEAR}} — Hecho con ☕ y vibe coding.

---

<div align="center">
Si esto te ahorra tiempo, dale ⭐ al repo — ayuda a que más gente lo encuentre.
</div>
