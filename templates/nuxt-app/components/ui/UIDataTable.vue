<script setup lang="ts" generic="T extends Record<string, unknown>">
import {
  useVueTable,
  getCoreRowModel,
  getSortedRowModel,
  FlexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/vue-table'

export interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Props {
  columns: ColumnDef<T>[]
  data: T[]
  loading?: boolean
  pagination?: PaginationInfo
  emptyText?: string
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  emptyText: 'Sin registros',
})

const emit = defineEmits<{
  'page-change': [page: number]
  'sort-change': [sorting: SortingState]
}>()

const sorting = ref<SortingState>([])

const table = useVueTable({
  get data() { return props.data },
  get columns() { return props.columns },
  state: {
    get sorting() { return sorting.value },
  },
  manualPagination: true,
  manualSorting: true,
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  onSortingChange: (updater) => {
    sorting.value = typeof updater === 'function' ? updater(sorting.value) : updater
    emit('sort-change', sorting.value)
  },
})
</script>

<template>
  <div class="w-full overflow-hidden rounded-xl border border-border bg-surface">
    <div class="overflow-x-auto">
      <table class="w-full text-sm">

        <!-- Head -->
        <thead class="border-b border-border bg-subtle-bg">
          <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
            <th
              v-for="header in headerGroup.headers"
              :key="header.id"
              :style="header.column.columnDef.size ? `width: ${header.column.columnDef.size}px` : ''"
              class="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted"
              :class="header.column.getCanSort() ? 'cursor-pointer select-none hover:text-text' : ''"
              @click="header.column.getToggleSortingHandler()?.($event)"
            >
              <span class="flex items-center gap-1.5">
                <FlexRender
                  v-if="!header.isPlaceholder"
                  :render="header.column.columnDef.header"
                  :props="header.getContext()"
                />
                <!-- Icono de orden -->
                <span v-if="header.column.getCanSort()" class="shrink-0">
                  <svg v-if="header.column.getIsSorted() === 'asc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" class="text-primary">
                    <path d="M6 2l4 5H2l4-5z"/>
                  </svg>
                  <svg v-else-if="header.column.getIsSorted() === 'desc'" width="12" height="12" viewBox="0 0 12 12" fill="currentColor" class="text-primary">
                    <path d="M6 10L2 5h8l-4 5z"/>
                  </svg>
                  <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="currentColor" class="text-faint">
                    <path d="M6 2l4 5H2l4-5zM6 10L2 5h8l-4 5z" opacity="0.4"/>
                  </svg>
                </span>
              </span>
            </th>
            <!-- Columna de acciones -->
            <th v-if="$slots.actions" class="px-4 py-3 text-right text-xs font-medium uppercase tracking-wide text-muted">
              Acciones
            </th>
          </tr>
        </thead>

        <!-- Body -->
        <tbody>
          <!-- Skeleton loading -->
          <template v-if="loading">
            <tr v-for="i in 5" :key="i" class="border-b border-border">
              <td
                v-for="header in table.getHeaderGroups()[0]?.headers"
                :key="header.id"
                class="px-4 py-3"
              >
                <div class="h-4 animate-pulse rounded bg-muted-bg" style="width: 70%" />
              </td>
              <td v-if="$slots.actions" class="px-4 py-3">
                <div class="ml-auto h-4 w-16 animate-pulse rounded bg-muted-bg" />
              </td>
            </tr>
          </template>

          <!-- Empty -->
          <template v-else-if="!data.length">
            <tr>
              <td
                :colspan="(table.getHeaderGroups()[0]?.headers.length ?? 0) + ($slots.actions ? 1 : 0)"
                class="px-4 py-14 text-center"
              >
                <div class="flex flex-col items-center gap-2">
                  <svg class="h-9 w-9 text-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                  </svg>
                  <span class="text-sm text-muted">{{ emptyText }}</span>
                </div>
              </td>
            </tr>
          </template>

          <!-- Rows -->
          <template v-else>
            <tr
              v-for="row in table.getRowModel().rows"
              :key="row.id"
              class="border-b border-border transition-colors last:border-0 hover:bg-surface-hover"
            >
              <td
                v-for="cell in row.getVisibleCells()"
                :key="cell.id"
                class="px-4 py-3 text-text"
              >
                <!-- Slot por columna: #cell-{columnId} -->
                <slot
                  :name="`cell-${cell.column.id}`"
                  :row="row.original"
                  :value="cell.getValue()"
                >
                  <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
                </slot>
              </td>
              <td v-if="$slots.actions" class="px-4 py-3">
                <div class="flex items-center justify-end gap-1">
                  <slot name="actions" :row="row.original" />
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <!-- Paginación -->
    <div
      v-if="pagination && pagination.totalPages > 1"
      class="flex items-center justify-between border-t border-border px-4 py-3"
    >
      <p class="text-xs text-[var(--color-muted)]">
        {{ (pagination.page - 1) * pagination.limit + 1 }}–{{ Math.min(pagination.page * pagination.limit, pagination.total) }}
        de {{ pagination.total }}
      </p>
      <div class="flex items-center gap-1">
        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-[var(--color-muted)] transition disabled:opacity-40 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
          :disabled="pagination.page === 1"
          @click="emit('page-change', pagination.page - 1)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>

        <template v-for="p in pagination.totalPages" :key="p">
          <button
            v-if="Math.abs(p - pagination.page) <= 2"
            class="flex h-8 w-8 items-center justify-center rounded-lg text-sm transition"
            :class="p === pagination.page
              ? 'bg-[var(--color-primary)] text-white font-medium'
              : 'text-[var(--color-muted)] hover:bg-[var(--color-muted-bg)]'"
            @click="emit('page-change', p)"
          >
            {{ p }}
          </button>
        </template>

        <button
          class="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-[var(--color-muted)] transition disabled:opacity-40 hover:border-[var(--color-border-strong)] hover:text-[var(--color-text)]"
          :disabled="pagination.page === pagination.totalPages"
          @click="emit('page-change', pagination.page + 1)"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>
