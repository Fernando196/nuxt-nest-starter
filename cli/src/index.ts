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
  .description('Generate projects ready for vibe coding with Claude Code')
  .version(pkg.version)

program
  .command('create [project-name]')
  .alias('c')
  .description('Create a new project from a template')
  .option('-t, --template <template>', 'Template to use: nuxt-app | nest-api | nuxt-nest-fullstack')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action(createProject)

program
  .command('list')
  .alias('ls')
  .description('List all available templates')
  .action(() => {
    console.log(chalk.bold('\n  Available templates:\n'))
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

// Default: if no subcommand is passed, run create directly
if (process.argv.length === 2) {
  process.argv.push('create')
}

program.parse()
