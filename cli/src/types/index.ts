export type Template = 'nuxt-app' | 'nest-api' | 'nuxt-nest-fullstack'

export interface ProjectOptions {
  template?: Template
  skipInstall?: boolean
  skipGit?: boolean
}

export interface TemplateConfig {
  name: Template
  label: string
  description: string
  packageManager: 'npm' | 'pnpm'
  postInstallMessage?: string
}

export const TEMPLATES: Record<Template, TemplateConfig> = {
  'nuxt-app': {
    name: 'nuxt-app',
    label: 'Nuxt 3 App',
    description: 'Nuxt 3 + TypeScript strict + Pinia + TailwindCSS + VeeValidate',
    packageManager: 'pnpm',
    postInstallMessage: 'pnpm dev → http://localhost:3000',
  },
  'nest-api': {
    name: 'nest-api',
    label: 'NestJS API',
    description: 'NestJS + TypeScript strict + TypeORM + PostgreSQL + Swagger',
    packageManager: 'pnpm',
    postInstallMessage: 'pnpm start:dev → http://localhost:3001/api',
  },
  'nuxt-nest-fullstack': {
    name: 'nuxt-nest-fullstack',
    label: 'Nuxt + NestJS Fullstack',
    description: 'Monorepo completo: Nuxt 3 frontend + NestJS backend + shared types',
    packageManager: 'pnpm',
    postInstallMessage: 'pnpm dev → frontend :3000 + backend :3001',
  },
}
