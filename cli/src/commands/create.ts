import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import ora from 'ora'
import { prompt } from 'enquirer'
import { execSync } from 'child_process'
import { Template, ProjectOptions, TEMPLATES } from '../types'
import { getTemplatesDir, validateProjectName, replaceTemplateVars } from '../utils/helpers'

export async function createProject(
  projectName: string | undefined,
  options: ProjectOptions
): Promise<void> {
  // 1. Project name
  if (!projectName) {
    const response = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: 'Project name?',
      initial: 'my-vibe-app',
      validate: validateProjectName,
    })
    projectName = response.name
  }

  if (!validateProjectName(projectName)) {
    console.error(chalk.red(`\n  ✗ Invalid name: "${projectName}"`))
    console.error(chalk.gray('  Use only lowercase letters, numbers and hyphens\n'))
    process.exit(1)
  }

  // 2. Template
  let template = options.template
  if (!template) {
    const response = await prompt<{ template: Template }>({
      type: 'select',
      name: 'template',
      message: 'Which template do you want to use?',
      choices: Object.values(TEMPLATES).map(t => ({
        name: t.name,
        message: `${chalk.bold(t.label)} ${chalk.gray('→ ' + t.description)}`,
        value: t.name,
      })),
    })
    template = response.template
  }

  const templateConfig = TEMPLATES[template]
  const targetDir = path.resolve(process.cwd(), projectName)

  // 3. Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    const { overwrite } = await prompt<{ overwrite: boolean }>({
      type: 'confirm',
      name: 'overwrite',
      message: `Folder "${projectName}" already exists. Overwrite?`,
      initial: false,
    })
    if (!overwrite) {
      console.log(chalk.yellow('\n  Operation cancelled.\n'))
      process.exit(0)
    }
    await fs.remove(targetDir)
  }

  console.log()

  const templatesDir = getTemplatesDir()
  const templateVars = {
    PROJECT_NAME: projectName,
    PROJECT_NAME_PASCAL: toPascalCase(projectName),
    YEAR: new Date().getFullYear().toString(),
  }
  const EXCLUDED_DIRS = new Set(['node_modules', '.nuxt', '.output', 'dist'])
  const copyFilter = (src: string) => {
    const relative = path.relative(templatesDir, src)
    return !relative.split(path.sep).some(segment => EXCLUDED_DIRS.has(segment))
  }

  if (template === 'nuxt-nest-fullstack') {
    // 4. Fullstack: copy nest-api → backend/ and nuxt-app → frontend/
    const spinner = ora(`Generating monorepo ${chalk.cyan(projectName)}...`).start()

    try {
      const backendDir = path.join(targetDir, 'backend')
      const frontendDir = path.join(targetDir, 'frontend')

      await fs.ensureDir(targetDir)

      await Promise.all([
        fs.copy(path.join(templatesDir, 'nest-api'), backendDir, { filter: copyFilter }),
        fs.copy(path.join(templatesDir, 'nuxt-app'), frontendDir, { filter: copyFilter }),
      ])

      await Promise.all([
        replaceTemplateVars(backendDir, templateVars),
        replaceTemplateVars(frontendDir, templateVars),
      ])

      // Actualizar package.json de cada subcarpeta
      for (const [subdir, suffix] of [[backendDir, 'backend'], [frontendDir, 'frontend']] as const) {
        const pkgPath = path.join(subdir, 'package.json')
        if (await fs.pathExists(pkgPath)) {
          const pkgJson = JSON.parse(await fs.readFile(pkgPath, 'utf-8')) as Record<string, unknown>
          pkgJson['name'] = `${projectName}-${suffix}`
          await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n', 'utf-8')
        }

        // Renombrar _gitignore → .gitignore
        const gitignorePath = path.join(subdir, '_gitignore')
        if (await fs.pathExists(gitignorePath)) {
          await fs.rename(gitignorePath, path.join(subdir, '.gitignore'))
        }
      }

      spinner.succeed(`Monorepo ${chalk.cyan(projectName)} created`)
    } catch (err) {
      spinner.fail('Error generating monorepo')
      console.error(err)
      process.exit(1)
    }

    // 5. Git init
    if (!options.skipGit) {
      const gitSpinner = ora('Initializing git...').start()
      try {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' })
        execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
        execSync('git commit -m "chore: initial commit from nuxt-nest-starter"', { cwd: targetDir, stdio: 'ignore' })
        gitSpinner.succeed('Git initialized')
      } catch {
        gitSpinner.warn('Could not initialize git (is it installed?)')
      }
    }

    // 6. Install dependencies in both subfolders
    if (!options.skipInstall) {
      for (const [label, subdir] of [['backend', path.join(targetDir, 'backend')], ['frontend', path.join(targetDir, 'frontend')]] as const) {
        const installSpinner = ora(`Installing ${label} dependencies...`).start()
        try {
          execSync(`${templateConfig.packageManager} install`, { cwd: subdir, stdio: 'ignore' })
          installSpinner.succeed(`${label} dependencies installed`)
        } catch {
          installSpinner.warn(`Could not install in ${label}. Run: cd ${projectName}/${label} && ${templateConfig.packageManager} install`)
        }
      }
    }

    // 7. Final message fullstack
    console.log(`
${chalk.bold.green('  ✓ Monorepo ready for vibe coding!')}

  ${chalk.gray('Project structure:')}
  ${chalk.cyan(projectName + '/')}
  ${chalk.gray('├──')} ${chalk.cyan('backend/')}  ${chalk.gray('→ NestJS API  (http://localhost:3001)')}
  ${chalk.gray('└──')} ${chalk.cyan('frontend/')} ${chalk.gray('→ Nuxt 3 App  (http://localhost:3000)')}

  ${chalk.gray('Start the backend:')}
  ${chalk.cyan(`cd ${projectName}/backend && ${templateConfig.packageManager} start:dev`)}

  ${chalk.gray('Start the frontend:')}
  ${chalk.cyan(`cd ${projectName}/frontend && ${templateConfig.packageManager} dev`)}

  ${chalk.gray('Open Claude Code at the root:')}
  ${chalk.cyan(`cd ${projectName} && claude`)}
`)
    return
  }

  // 4. Simple template: copy directly
  const spinner = ora(`Generating ${chalk.cyan(projectName)} from ${chalk.bold(templateConfig.label)}...`).start()

  try {
    const templateSrc = path.join(templatesDir, template)

    await fs.copy(templateSrc, targetDir, { filter: copyFilter })

    await replaceTemplateVars(targetDir, templateVars)

    // Override package.json name with the actual project name
    const pkgPath = path.join(targetDir, 'package.json')
    if (await fs.pathExists(pkgPath)) {
      const pkgRaw = await fs.readFile(pkgPath, 'utf-8')
      const pkgJson = JSON.parse(pkgRaw) as Record<string, unknown>
      pkgJson['name'] = projectName
      await fs.writeFile(pkgPath, JSON.stringify(pkgJson, null, 2) + '\n', 'utf-8')
    }

    // Renombrar _gitignore → .gitignore
    const gitignorePath = path.join(targetDir, '_gitignore')
    if (await fs.pathExists(gitignorePath)) {
      await fs.rename(gitignorePath, path.join(targetDir, '.gitignore'))
    }

    spinner.succeed(`Project ${chalk.cyan(projectName)} created`)
  } catch (err) {
    spinner.fail('Error copying template')
    console.error(err)
    process.exit(1)
  }

  // 5. Git init
  if (!options.skipGit) {
    const gitSpinner = ora('Initializing git...').start()
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' })
      execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
      execSync('git commit -m "chore: initial commit from nuxt-nest-starter"', { cwd: targetDir, stdio: 'ignore' })
      gitSpinner.succeed('Git initialized')
    } catch {
      gitSpinner.warn('Could not initialize git (is it installed?)')
    }
  }

  // 6. Install dependencies
  if (!options.skipInstall) {
    const installSpinner = ora(`Installing dependencies with ${templateConfig.packageManager}...`).start()
    try {
      execSync(`${templateConfig.packageManager} install`, { cwd: targetDir, stdio: 'ignore' })
      installSpinner.succeed('Dependencies installed')
    } catch {
      installSpinner.warn(`Could not install. Run: cd ${projectName} && ${templateConfig.packageManager} install`)
    }
  }

  // 7. Final message
  console.log(`
${chalk.bold.green('  ✓ Ready for vibe coding!')}

  ${chalk.gray('Enter your project:')}
  ${chalk.cyan(`cd ${projectName}`)}

  ${chalk.gray('Open Claude Code:')}
  ${chalk.cyan('claude')}

  ${chalk.gray('CLAUDE.md is already configured with pro instructions.')}
  ${chalk.gray('Use the prompts in')} ${chalk.cyan('docs/prompts.md')} ${chalk.gray('to get started.')}

  ${chalk.gray('Start the server:')}
  ${chalk.cyan(`${templateConfig.packageManager} dev`)}
  ${chalk.gray('→ ' + templateConfig.postInstallMessage)}
`)
}

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}
