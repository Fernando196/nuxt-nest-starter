<script setup lang="ts">
interface NavItem {
  label: string
  to: string
  icon: string  // nombre del icono (SVG inline)
}

// Edita estos items con las rutas de tu app
const navItems: NavItem[] = [
  { label: 'Usuarios', to: '/users', icon: 'users' },
]

const isCollapsed = ref<boolean>(false)
</script>

<template>
  <aside
    class="fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-border bg-surface transition-all duration-200"
    :class="isCollapsed ? 'w-16' : 'w-60'"
  >
    <!-- Logo / Brand -->
    <div class="flex h-16 items-center border-b border-border px-4">
      <NuxtLink to="/" class="flex items-center gap-2 overflow-hidden">
        <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
          N
        </div>
        <span
          v-if="!isCollapsed"
          class="font-medium text-text truncate transition-opacity"
        >
          {{PROJECT_NAME}}
        </span>
      </NuxtLink>
    </div>

    <!-- Nav links -->
    <nav class="flex-1 overflow-y-auto py-4">
      <ul class="flex flex-col gap-1 px-2">
        <li v-for="item in navItems" :key="item.to">
          <NuxtLink
            :to="item.to"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-subtle-bg hover:text-text"
            active-class="bg-primary-light text-primary-dark font-medium"
          >
            <!-- Icono genérico — reemplaza con tu librería de íconos (Lucide, Heroicons, etc.) -->
            <svg class="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <span v-if="!isCollapsed" class="truncate">{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- Collapse toggle -->
    <div class="border-t border-border p-2">
      <button
        class="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-muted transition hover:bg-subtle-bg hover:text-text"
        @click="isCollapsed = !isCollapsed"
      >
        <svg
          class="h-4 w-4 shrink-0 transition-transform"
          :class="isCollapsed ? 'rotate-180' : ''"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7M18 19l-7-7 7-7"/>
        </svg>
        <span v-if="!isCollapsed">Colapsar</span>
      </button>
    </div>
  </aside>
</template>
