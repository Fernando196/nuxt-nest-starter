# Contribuir a nuxt-nest-starter

¡Gracias por querer contribuir! Aquí están las guías para mantener la calidad del repo.

## ¿Qué se puede contribuir?

- **Nuevos templates** — stacks que faltan (SvelteKit, Astro, Fastify, etc.)
- **Mejoras al CLAUDE.md** — instrucciones más precisas, mejores ejemplos
- **Más prompts** — en `docs/prompts.md`
- **Mejoras al CLI** — mejor UX, más opciones
- **Correcciones** — bugs, typos, versiones desactualizadas

## Reglas para templates

Todo template debe incluir obligatoriamente:

1. **`CLAUDE.md`** con:
   - Contexto del proyecto (stack, versiones)
   - Estructura de carpetas explicada
   - Reglas de TypeScript del stack
   - Reglas de arquitectura específicas
   - Lista de cosas prohibidas
   - Comandos útiles

2. **TypeScript strict** — `strict: true` en tsconfig es el mínimo. Idealmente también `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes`.

3. **Sin `any`** — si el template usa `any` en algún lado, no se acepta.

4. **Al menos un módulo de ejemplo** — que demuestre los patrones del template.

5. **Variables de template** — usa `{{PROJECT_NAME}}` en `package.json` y archivos de config. El CLI las reemplaza automáticamente.

## Proceso para un nuevo template

```bash
# 1. Fork y clone
git clone https://github.com/tu-usuario/nuxt-nest-starter
cd nuxt-nest-starter

# 2. Crea la carpeta del template
cp -r templates/nuxt-app templates/mi-template

# 3. Desarrolla el template
# - Edita CLAUDE.md
# - Configura TypeScript strict
# - Crea el módulo de ejemplo
# - Añade package.json con {{PROJECT_NAME}}

# 4. Prueba con el CLI
node cli/dist/index.js create test-project --template mi-template
cd test-project && npm install && npm run typecheck

# 5. Agrega prompts en docs/prompts.md

# 6. Actualiza el README.md con el nuevo template

# 7. PR con descripción clara
```

## Checklist para el PR

- [ ] El template genera un proyecto que compila sin errores TypeScript
- [ ] `CLAUDE.md` tiene todos los campos requeridos
- [ ] No hay ningún `any` en el código del template
- [ ] El nombre del template es descriptivo y en kebab-case
- [ ] Se añadieron al menos 3 prompts en `docs/prompts.md`
- [ ] Se actualizó el `README.md` con la nueva entrada

## Code style

- TypeScript en todo — el CLI también es TypeScript
- Nombres de variables y funciones en inglés
- Comentarios en español (para la comunidad latina)
- Commits en inglés siguiendo conventional commits: `feat:`, `fix:`, `docs:`, `chore:`
