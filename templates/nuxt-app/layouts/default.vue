<template>
  <div class="min-h-screen bg-background">
    <!-- Sidebar -->
    <LayoutSidebar />

    <!-- Contenido principal -->
    <div class="flex flex-col transition-all duration-200" style="margin-left: var(--sidebar-width, 15rem)">
      <!-- Topnav -->
      <LayoutTopNav>
        <template #title>
          <slot name="title" />
        </template>
        <template #actions>
          <slot name="nav-actions" />
        </template>
      </LayoutTopNav>

      <!-- Page content -->
      <main class="mt-16 min-h-[calc(100vh-4rem)] p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
