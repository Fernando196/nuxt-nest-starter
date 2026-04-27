#!/usr/bin/env node
import { program } from 'commander'
import chalk from 'chalk'
import { createProject } from './commands/create'

const pkg = require('../../package.json') as { version: string }

console.log(
  chalk.bold.cyan('\n  🚀 nuxt-nest-starter') +
  chalk.gray(` v${pkg.version}\n`)
)

program
  .name('nuxt-nest-starter')
  .description('Genera proyectos listos para vibe coding con Claude Code')
  .version(pkg.version)

program
  .command('create [project-name]')
  .alias('c')
  .description('Crea un nuevo proyecto desde un template')
  .option('-t, --template <template>', 'Template a usar: nuxt-app | nest-api | nuxt-nest-fullstack')
  .option('--skip-install', 'Omitir instalación de dependencias')
  .option('--skip-git', 'Omitir inicialización de git')
  .action(createProject)

program
  .command('list')
  .alias('ls')
  .description('Lista todos los templates disponibles')
  .action(() => {
    console.log(chalk.bold('\n  Templates disponibles:\n'))
    const templates = [
      { name: 'nuxt-app', desc: 'Nuxt 3 + TypeScript + Pinia + TailwindCSS', color: chalk.green },
      { name: 'nest-api', desc: 'NestJS + TypeScript + TypeORM + Swagger', color: chalk.blue },
      { name: 'nuxt-nest-fullstack', desc: 'Nuxt 3 + NestJS fullstack monorepo', color: chalk.magenta },
    ]
    templates.forEach(t => {
      console.log(`  ${t.color('●')} ${chalk.bold(t.name)}`)
      console.log(`    ${chalk.gray(t.desc)}\n`)
    })
  })

// Default: si no se pasa subcomando, corre create directamente
if (process.argv.length === 2) {
  process.argv.push('create')
}

program.parse()
