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
  // 1. Nombre del proyecto
  if (!projectName) {
    const response = await prompt<{ name: string }>({
      type: 'input',
      name: 'name',
      message: '¿Nombre del proyecto?',
      initial: 'my-vibe-app',
      validate: validateProjectName,
    })
    projectName = response.name
  }

  if (!validateProjectName(projectName)) {
    console.error(chalk.red(`\n  ✗ Nombre inválido: "${projectName}"`))
    console.error(chalk.gray('  Usa solo letras minúsculas, números y guiones\n'))
    process.exit(1)
  }

  // 2. Template
  let template = options.template
  if (!template) {
    const response = await prompt<{ template: Template }>({
      type: 'select',
      name: 'template',
      message: '¿Qué template quieres usar?',
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

  // 3. Verificar si el directorio ya existe
  if (await fs.pathExists(targetDir)) {
    const { overwrite } = await prompt<{ overwrite: boolean }>({
      type: 'confirm',
      name: 'overwrite',
      message: `La carpeta "${projectName}" ya existe. ¿Sobreescribir?`,
      initial: false,
    })
    if (!overwrite) {
      console.log(chalk.yellow('\n  Operación cancelada.\n'))
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
  const copyFilter = (src: string) =>
    !src.includes('node_modules') && !src.includes('.nuxt') && !src.includes('dist')

  if (template === 'nuxt-nest-fullstack') {
    // 4. Fullstack: copiar nest-api → backend/ y nuxt-app → frontend/
    const spinner = ora(`Generando monorepo ${chalk.cyan(projectName)}...`).start()

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

      spinner.succeed(`Monorepo ${chalk.cyan(projectName)} creado`)
    } catch (err) {
      spinner.fail('Error al generar el monorepo')
      console.error(err)
      process.exit(1)
    }

    // 5. Git init
    if (!options.skipGit) {
      const gitSpinner = ora('Inicializando git...').start()
      try {
        execSync('git init', { cwd: targetDir, stdio: 'ignore' })
        execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
        execSync('git commit -m "chore: initial commit from nuxt-nest-starter"', { cwd: targetDir, stdio: 'ignore' })
        gitSpinner.succeed('Git inicializado')
      } catch {
        gitSpinner.warn('No se pudo inicializar git (¿está instalado?)')
      }
    }

    // 6. Instalar dependencias en ambas subcarpetas
    if (!options.skipInstall) {
      for (const [label, subdir] of [['backend', path.join(targetDir, 'backend')], ['frontend', path.join(targetDir, 'frontend')]] as const) {
        const installSpinner = ora(`Instalando dependencias en ${label}...`).start()
        try {
          execSync(`${templateConfig.packageManager} install`, { cwd: subdir, stdio: 'ignore' })
          installSpinner.succeed(`Dependencias de ${label} instaladas`)
        } catch {
          installSpinner.warn(`No se pudo instalar en ${label}. Corre: cd ${projectName}/${label} && ${templateConfig.packageManager} install`)
        }
      }
    }

    // 7. Mensaje final fullstack
    console.log(`
${chalk.bold.green('  ✓ ¡Monorepo listo para vibe coding!')}

  ${chalk.gray('Estructura del proyecto:')}
  ${chalk.cyan(projectName + '/')}
  ${chalk.gray('├──')} ${chalk.cyan('backend/')}  ${chalk.gray('→ NestJS API  (http://localhost:3001)')}
  ${chalk.gray('└──')} ${chalk.cyan('frontend/')} ${chalk.gray('→ Nuxt 3 App  (http://localhost:3000)')}

  ${chalk.gray('Levanta el backend:')}
  ${chalk.cyan(`cd ${projectName}/backend && ${templateConfig.packageManager} start:dev`)}

  ${chalk.gray('Levanta el frontend:')}
  ${chalk.cyan(`cd ${projectName}/frontend && ${templateConfig.packageManager} dev`)}

  ${chalk.gray('Abre Claude Code en la raíz:')}
  ${chalk.cyan(`cd ${projectName} && claude`)}
`)
    return
  }

  // 4. Template simple: copiar directamente
  const spinner = ora(`Generando ${chalk.cyan(projectName)} desde ${chalk.bold(templateConfig.label)}...`).start()

  try {
    const templateSrc = path.join(templatesDir, template)

    await fs.copy(templateSrc, targetDir, { filter: copyFilter })

    await replaceTemplateVars(targetDir, templateVars)

    // Sobreescribir el name del package.json con el nombre real del proyecto
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

    spinner.succeed(`Proyecto ${chalk.cyan(projectName)} creado`)
  } catch (err) {
    spinner.fail('Error al copiar el template')
    console.error(err)
    process.exit(1)
  }

  // 5. Git init
  if (!options.skipGit) {
    const gitSpinner = ora('Inicializando git...').start()
    try {
      execSync('git init', { cwd: targetDir, stdio: 'ignore' })
      execSync('git add -A', { cwd: targetDir, stdio: 'ignore' })
      execSync('git commit -m "chore: initial commit from nuxt-nest-starter"', { cwd: targetDir, stdio: 'ignore' })
      gitSpinner.succeed('Git inicializado')
    } catch {
      gitSpinner.warn('No se pudo inicializar git (¿está instalado?)')
    }
  }

  // 6. Instalar dependencias
  if (!options.skipInstall) {
    const installSpinner = ora(`Instalando dependencias con ${templateConfig.packageManager}...`).start()
    try {
      execSync(`${templateConfig.packageManager} install`, { cwd: targetDir, stdio: 'ignore' })
      installSpinner.succeed('Dependencias instaladas')
    } catch {
      installSpinner.warn(`No se pudo instalar. Corre: cd ${projectName} && ${templateConfig.packageManager} install`)
    }
  }

  // 7. Mensaje final
  console.log(`
${chalk.bold.green('  ✓ ¡Listo para vibe coding!')}

  ${chalk.gray('Entra a tu proyecto:')}
  ${chalk.cyan(`cd ${projectName}`)}

  ${chalk.gray('Abre Claude Code:')}
  ${chalk.cyan('claude')}

  ${chalk.gray('El CLAUDE.md ya está configurado con instrucciones pro.')}
  ${chalk.gray('Usa los prompts en')} ${chalk.cyan('docs/prompts.md')} ${chalk.gray('para empezar.')}

  ${chalk.gray('Levanta el servidor:')}
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
