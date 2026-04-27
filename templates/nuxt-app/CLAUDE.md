# CLAUDE.md — {{PROJECT_NAME}}

> Archivo de instrucciones para Claude Code. Lee esto antes de tocar cualquier archivo.

## 🧠 Contexto del proyecto

Este es **{{PROJECT_NAME}}**, una aplicación web construida con:
- **Nuxt 3** — SSR/SSG/SPA framework
- **TypeScript strict** — sin `any`, sin atajos
- **Pinia** — manejo de estado (Composition API)
- **TailwindCSS v4** — estilos con `@theme` en `assets/css/main.css`
- **VueUse** — composables utilitarios (useDebounceFn, useStorage, etc.)
- **nuxt-auth-utils** — autenticación de sesión

## 📁 Estructura de carpetas

```
├── assets/css/main.css      # @theme con todos los tokens de color — EDITA AQUÍ LOS COLORES
├── components/
│   ├── ui/                  # Componentes reutilizables ya creados:
│   │   ├── UIModal.vue      #   Modal accesible con Teleport
│   │   ├── UIDataTable.vue  #   Tabla genérica con paginación y ordenamiento
│   │   ├── UIButton.vue     #   Botón con variantes y loading
│   │   └── UIInput.vue      #   Input con label, error y hint
│   └── layout/
│       ├── LayoutSidebar.vue  # Sidebar fijo colapsable
│       └── LayoutTopNav.vue   # Barra superior con menú de usuario
├── composables/
│   └── useApi.ts            # Wrapper de $fetch tipado con auth automático
├── layouts/
│   └── default.vue          # Sidebar + Topnav — úsalo con definePageMeta
├── pages/
│   └── users.vue            # Ejemplo CRUD completo — úsalo como base
├── stores/
│   └── auth.store.ts        # Store de autenticación con Pinia
└── types/
    └── index.ts             # Tipos globales: User, ApiResponse<T>, etc.
```

## 🎨 Sistema de colores (TailwindCSS v4)

Los colores están en `assets/css/main.css` dentro de `@theme {}`.
Para usar un color en un componente usa la variable CSS directamente:

```vue
<!-- ✅ Correcto — usa variables CSS del tema -->
<div class="bg-[var(--color-primary)] text-white">Primario</div>
<p class="text-[var(--color-muted)]">Texto secundario</p>
<div class="border border-[var(--color-border)]">Con borde</div>

<!-- Variables disponibles -->
--color-primary / --color-primary-dark / --color-primary-light
--color-secondary / --color-secondary-dark
--color-accent
--color-background / --color-surface / --color-subtle-bg
--color-text / --color-text-subtle / --color-muted / --color-faint
--color-border / --color-border-strong
--color-success / --color-success-bg / --color-success-text
--color-error / --color-error-bg / --color-error-text
--color-warning / --color-warning-bg
--color-info / --color-info-bg
--shadow-sm / --shadow-md / --shadow-lg
```

## ⚙️ Reglas de TypeScript

- **NUNCA uses `any`**. Si no sabes el tipo, usa `unknown` + narrowing.
- Todos los `ref()` con tipo explícito: `ref<string>('')`, `ref<User | null>(null)`.
- Usa `readonly` en props que no se modifican.
- Prefiere `interface` sobre `type` para objetos.

## 🎨 Reglas de componentes Vue

- `<script setup lang="ts">` siempre — sin Options API
- Props con `interface` tipada y `withDefaults`
- Emits tipados: `defineEmits<{ close: [], 'update:modelValue': [value: boolean] }>()`
- Nombres de componentes en PascalCase, archivos en PascalCase
- Componentes de `ui/` no tienen lógica de negocio — solo presentación

```vue
<!-- ✅ Patrón correcto para página con CRUD -->
<script setup lang="ts">
definePageMeta({ layout: 'default', title: 'Mi sección' })
// Ver pages/users.vue como ejemplo completo a seguir
</script>
```

## 🗂️ Cómo usar el layout sidebar + topnav

Cualquier página que use el layout con sidebar y topnav:

```vue
<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Nombre de la sección',  // aparece en el topnav
})
</script>
```

Para agregar links al sidebar edita el array `navItems` en `components/layout/LayoutSidebar.vue`.

## 📦 Cómo usar UIDataTable

```vue
<UIDataTable
  :columns="columns"    <!-- Column<T>[] — ver UIDataTable.vue para el tipo -->
  :data="items"
  :loading="isLoading"
  :pagination="{ page, limit: 10, total, totalPages }"
  row-key="id"
  @page-change="(p) => { page = p; fetch() }"
>
  <!-- Personalizar celda -->
  <template #cell-status="{ value, row }">
    <span class="text-[var(--color-success)]">{{ value }}</span>
  </template>
  <!-- Acciones por fila -->
  <template #actions="{ row }">
    <UIButton size="sm" variant="ghost" @click="edit(row)">Editar</UIButton>
  </template>
</UIDataTable>
```

## 🪟 Cómo usar UIModal

```vue
<UIButton @click="isOpen = true">Abrir</UIButton>

<UIModal v-model="isOpen" title="Título" size="md">
  <!-- Contenido -->
  <template #footer>
    <UIButton variant="secondary" @click="isOpen = false">Cancelar</UIButton>
    <UIButton @click="guardar">Guardar</UIButton>
  </template>
</UIModal>
```

## 🌐 useApi — llamadas al backend

```typescript
const { get, post, put, del } = useApi()

// GET con paginación
const res = await get<{ data: { items: User[], total: number } }>('/users', { page: 1, limit: 10 })

// POST
const user = await post<CreateUserDto, User>('/users', { name: 'Juan', email: 'juan@mail.com' })

// PUT / PATCH / DELETE
await put('/users/123', { name: 'Juan Actualizado' })
await del('/users/123')
```

## 🚫 Cosas que NUNCA debes hacer

- No uses WebSockets/Socket.io — este proyecto usa HTTP REST
- No uses `$fetch` directamente en componentes — usa `useApi()`
- No uses `<style scoped>` con Tailwind — usa clases inline o variables CSS
- No hagas lógica de negocio en componentes `ui/` — van en páginas o composables
- No uses Options API — solo Composition API con `<script setup>`
- No mutates props — usa `emit` para comunicar cambios al padre

## ✅ Comandos

```bash
pnpm dev          # Servidor de desarrollo → http://localhost:3000
pnpm build        # Build de producción
pnpm typecheck    # Verifica tipos
pnpm lint         # ESLint
pnpm test         # Vitest
```

## 🪟 Sistema de modales programático (useModal)

Los modales se abren desde código, **no con v-model en el template**. Esto permite esperar el resultado como una promesa.

**Setup (ya está en app.vue):**
```vue
<!-- app.vue -->
<template>
  <NuxtLayout><NuxtPage /></NuxtLayout>
  <ModalHost />  <!-- ← registrado aquí una vez, globalmente -->
</template>
```

**Cómo abrir un modal desde una página o composable:**
```ts
const { openModal } = useModal()

// Abrir y esperar el resultado
const saved = await openModal<boolean>(UserFormModal)
if (saved) await fetchData()  // solo refresca si guardó

// Con props al modal
const result = await openModal<boolean>(UserFormModal, { user: rowToEdit })
```

**Cómo crear un modal:**
```vue
<!-- components/modals/MiModal.vue -->
<script setup lang="ts">
interface Props { user?: User }
const props = defineProps<Props>()
const emit = defineEmits<{ close: [saved?: boolean] }>()
</script>

<template>
  <UIModal title="Mi modal" @close="emit('close')">
    <!-- contenido -->
    <template #footer="{ close }">
      <UIButton variant="secondary" @click="close()">Cancelar</UIButton>
      <UIButton @click="guardar">Guardar</UIButton>
    </template>
  </UIModal>
</template>
```

**Regla:** todos los modales van en `components/modals/`. El nombre describe su función: `UserFormModal.vue`, `ConfirmDeleteModal.vue`, `ProductDetailModal.vue`.

## 📊 UIDataTable con TanStack Vue Table

```ts
import type { ColumnDef } from '@tanstack/vue-table'

const columns: ColumnDef<User>[] = [
  { accessorKey: 'name', header: 'Nombre', enableSorting: true },
  { accessorKey: 'email', header: 'Email' },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
    cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString('es-MX'),
  },
]
```

```vue
<UIDataTable
  :columns="columns"
  :data="items"
  :loading="isLoading"
  :pagination="{ page, limit: 10, total, totalPages }"
  @page-change="(p) => { page = p; fetch() }"
  @sort-change="(sorting) => console.log(sorting)"
>
  <!-- Celda personalizada por columna -->
  <template #cell-role="{ value }">
    <span class="badge">{{ value }}</span>
  </template>

  <!-- Acciones por fila -->
  <template #actions="{ row }">
    <UIButton size="sm" variant="ghost" @click="openEdit(row)">Editar</UIButton>
  </template>
</UIDataTable>
```

## 📄 UIPageHeader

```vue
<UIPageHeader title="Usuarios" subtitle="128 registros">
  <!-- Botones en la esquina derecha -->
  <template #right>
    <UIButton @click="openCreate">Nuevo usuario</UIButton>
  </template>
  <!-- Filtros / buscador debajo del título -->
  <template #bottom>
    <UIInput v-model="search" placeholder="Buscar..." />
  </template>
</UIPageHeader>
```
