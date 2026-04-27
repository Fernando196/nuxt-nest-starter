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

  // 4. Copiar template
  const spinner = ora(`Generando ${chalk.cyan(projectName)} desde ${chalk.bold(templateConfig.label)}...`).start()

  try {
    const templatesDir = getTemplatesDir()
    const templateSrc = path.join(templatesDir, template)

    await fs.copy(templateSrc, targetDir, {
      filter: (src: string) => !src.includes('node_modules') && !src.includes('.nuxt') && !src.includes('dist'),
    })

    // Reemplazar variables {{VAR}} en archivos
    await replaceTemplateVars(targetDir, {
      PROJECT_NAME: projectName,
      PROJECT_NAME_PASCAL: toPascalCase(projectName),
      YEAR: new Date().getFullYear().toString(),
    })

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
