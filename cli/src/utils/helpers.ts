import path from 'path'
import fs from 'fs-extra'

/**
 * Devuelve el directorio de templates relativo al CLI
 */
export function getTemplatesDir(): string {
  // En dev: cli/src/../../../templates → templates/
  // En prod (npm global): resuelve desde el paquete instalado
  const candidates = [
    path.resolve(__dirname, '../../../templates'),
    path.resolve(__dirname, '../../templates'),
    path.resolve(process.cwd(), 'templates'),
  ]
  for (const dir of candidates) {
    if (fs.pathExistsSync(dir)) return dir
  }
  throw new Error('No se encontró el directorio de templates. ¿Estás corriendo el CLI desde la raíz del repo?')
}

/**
 * Valida que el nombre de proyecto sea kebab-case válido
 */
export function validateProjectName(name: string): boolean | string {
  if (!name || name.trim() === '') return 'El nombre no puede estar vacío'
  if (!/^[a-z0-9-]+$/.test(name)) return 'Solo letras minúsculas, números y guiones'
  if (name.startsWith('-') || name.endsWith('-')) return 'No puede empezar ni terminar con guión'
  if (name.length > 64) return 'Máximo 64 caracteres'
  return true
}

/**
 * Reemplaza variables {{VAR}} en todos los archivos de texto de un directorio
 */
export async function replaceTemplateVars(
  dir: string,
  vars: Record<string, string>
): Promise<void> {
  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      if (['node_modules', '.nuxt', '.output', 'dist', '.git'].includes(entry.name)) continue
      await replaceTemplateVars(fullPath, vars)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)
      const textExtensions = ['.ts', '.js', '.vue', '.json', '.md', '.env', '.yml', '.yaml', '.html', '.css', '.mjs']
      if (!textExtensions.includes(ext) && !entry.name.startsWith('.')) continue

      try {
        let content = await fs.readFile(fullPath, 'utf-8')
        let changed = false

        for (const [key, value] of Object.entries(vars)) {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
          if (regex.test(content)) {
            content = content.replace(regex, value)
            changed = true
          }
        }

        if (changed) await fs.writeFile(fullPath, content, 'utf-8')
      } catch {
        // Archivos binarios — ignorar
      }
    }
  }
}
