<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex flex-col gap-3">
    <!-- Fila principal: título + slot derecho (botones, filtros, etc.) -->
    <div class="flex items-start justify-between gap-4">
      <div class="flex flex-col gap-0.5">
        <h1 class="text-xl font-semibold tracking-tight text-text">
          {{ title }}
        </h1>
        <p v-if="subtitle" class="text-[13.5px] text-muted">
          {{ subtitle }}
        </p>
      </div>

      <!-- Slot derecho: botón de crear, acciones principales -->
      <div v-if="$slots.right" class="flex shrink-0 items-center gap-2">
        <slot name="right" />
      </div>
    </div>

    <!-- Slot inferior: tabs, filtros, buscador -->
    <div v-if="$slots.bottom">
      <slot name="bottom" />
    </div>
  </div>
</template>
