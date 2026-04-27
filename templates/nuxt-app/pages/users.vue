<script setup lang="ts">
import type { ColumnDef } from '@tanstack/vue-table'
import UserFormModal from '~/components/modals/UserFormModal.vue'

definePageMeta({ layout: 'default', title: 'Usuarios' })

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  active: boolean
  createdAt: string
}

// ─── Estado ───────────────────────────────────────────────────────────────────

const { get, del } = useApi()
const { openModal } = useModal()

const users = ref<User[]>([])
const isLoading = ref<boolean>(false)
const fetchError = ref<string | null>(null)
const search = ref<string>('')
const page = ref<number>(1)
const total = ref<number>(0)
const totalPages = ref<number>(1)
const LIMIT = 10

// ─── Columnas TanStack ────────────────────────────────────────────────────────

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
    enableSorting: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    enableSorting: true,
  },
  {
    accessorKey: 'role',
    header: 'Rol',
    enableSorting: false,
  },
  {
    accessorKey: 'active',
    header: 'Estado',
    enableSorting: false,
  },
  {
    accessorKey: 'createdAt',
    header: 'Creado',
    enableSorting: true,
    cell: ({ getValue }) => new Date(String(getValue())).toLocaleDateString('es-MX'),
  },
]

// ─── Fetch ────────────────────────────────────────────────────────────────────

async function fetchUsers(): Promise<void> {
  isLoading.value = true
  fetchError.value = null
  try {
    const res = await get<{ data: { items: User[]; total: number; totalPages: number } }>(
      '/users',
       { page: page.value, limit: LIMIT, ...(search.value ? { search: search.value } : {}) },
    )
    users.value = res.data.items
    total.value = res.data.total
    totalPages.value = res.data.totalPages
  } catch (e) {
    fetchError.value = e instanceof Error ? e.message : 'Error al cargar usuarios'
  } finally {
    isLoading.value = false
  }
}

const debouncedSearch = useDebounceFn(fetchUsers, 300)
watch(search, () => { page.value = 1; debouncedSearch() })
onMounted(fetchUsers)

// ─── Acciones con modal programático ──────────────────────────────────────────

async function openCreate(): Promise<void> {
  const saved = await openModal<boolean>(UserFormModal)
  if (saved) await fetchUsers()
}

async function openEdit(user: User): Promise<void> {
  const saved = await openModal<boolean>(UserFormModal, { user })
  if (saved) await fetchUsers()
}

async function handleDelete(user: User): Promise<void> {
  if (!confirm(`¿Eliminar a "${user.name}"?`)) return
  await del(`/users/${user.id}`)
  await fetchUsers()
}
</script>

<template>
  <div class="flex flex-col gap-6">

    <UIPageHeader title="Usuarios" :subtitle="`${total} registros en total`">
      <template #right>
        <UIButton @click="openCreate">
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
          </svg>
          Nuevo usuario
        </UIButton>
      </template>
      <template #bottom>
        <UIInput v-model="search" placeholder="Buscar..." type="search" />
      </template>
    </UIPageHeader>

    <div
      v-if="fetchError"
      class="rounded-xl border border-error bg-error-bg px-4 py-3 text-sm text-error-text"
    >
      {{ fetchError }}
    </div>

    <UIDataTable
      :columns="columns"
      :data="users"
      :loading="isLoading"
      :pagination="{ page, limit: LIMIT, total, totalPages }"
      empty-text="No se encontraron usuarios"
      @page-change="(p) => { page = p; fetchUsers() }"
    >
      <!-- Celda rol -->
      <template #cell-role="{ value }">
        <span
          class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          :class="value === 'admin'
            ? 'bg-secondary-light text-secondary-dark'
            : 'bg-muted-bg text-muted'"
        >
          {{ value === 'admin' ? 'Admin' : 'Usuario' }}
        </span>
      </template>

      <!-- Celda estado -->
      <template #cell-active="{ value }">
        <span class="inline-flex items-center gap-1.5 text-xs font-medium"
          :class="value ? 'text-success' : 'text-muted'">
          <span class="h-1.5 w-1.5 rounded-full"
            :class="value ? 'bg-success' : 'bg-faint'" />
          {{ value ? 'Activo' : 'Inactivo' }}
        </span>
      </template>

      <!-- Acciones -->
      <template #actions="{ row }">
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg text-muted hover:bg-subtle-bg hover:text-text"
          title="Editar"
          @click="openEdit(row)"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 3.487a2.25 2.25 0 113.182 3.182L7.5 19.213l-4 1 1-4 12.362-12.726z"/>
          </svg>
        </button>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg text-error hover:bg-error-bg hover:text-error"
          title="Eliminar"
          @click="handleDelete(row)"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3M4 7h16"/>
          </svg>
        </button>
      </template>
    </UIDataTable>

  </div>
</template>
