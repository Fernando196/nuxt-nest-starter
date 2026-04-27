<script setup lang="ts">
const authStore = useAuthStore()
const isUserMenuOpen = ref<boolean>(false)

async function handleLogout(): Promise<void> {
  isUserMenuOpen.value = false
  await authStore.logout()
}
</script>

<template>
  <header class="fixed right-0 top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface px-4 transition-all duration-200"
    style="left: var(--sidebar-width, 15rem)"
  >
    <!-- Lado izquierdo: breadcrumb o título de la página -->
    <div>
      <slot name="title">
        <h1 class="text-base font-medium text-text">
          {{ $route.meta.title ?? 'Dashboard' }}
        </h1>
      </slot>
    </div>

    <!-- Lado derecho: acciones + usuario -->
    <div class="flex items-center gap-2">
      <slot name="actions" />

      <!-- Menú de usuario -->
      <div class="relative">
        <button
          class="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition hover:bg-subtle-bg"
          @click="isUserMenuOpen = !isUserMenuOpen"
        >
          <div class="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-medium text-primary-dark">
            {{ authStore.displayName.charAt(0).toUpperCase() }}
          </div>
          <span class="hidden text-text sm:inline">{{ authStore.displayName }}</span>
          <svg class="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        <!-- Backdrop para cerrar el menú al hacer click fuera -->
        <div
          v-if="isUserMenuOpen"
          class="fixed inset-0 z-40"
          @click="isUserMenuOpen = false"
        />

        <!-- Dropdown -->
        <Transition
          enter-active-class="transition-all duration-100"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-75"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isUserMenuOpen"
            class="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-border bg-surface py-1 shadow-md"
          >
            <div class="border-b border-border px-3 py-2">
              <p class="text-xs font-medium text-text truncate">{{ authStore.displayName }}</p>
              <p class="text-xs text-muted truncate">{{ authStore.user?.email }}</p>
            </div>
            <NuxtLink
              to="/profile"
              class="flex items-center gap-2 px-3 py-2 text-sm text-muted transition hover:bg-subtle-bg hover:text-text"
              @click="isUserMenuOpen = false"
            >
              Mi perfil
            </NuxtLink>
            <button
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-error transition hover:bg-error-bg"
              @click="handleLogout"
            >
              Cerrar sesión
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
