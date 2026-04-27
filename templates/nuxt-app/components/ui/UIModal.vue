<script setup lang="ts">
/**
 * UIModal — panel base para modales.
 *
 * 1. Programática (recomendada) con useModal():
 *    const { openModal } = useModal()
 *    const result = await openModal(MiModalComponent, { userId: '123' })
 *    // El componente emite @close(data?) para resolver la promesa
 *
 * 2. Declarativa:
 *    <UIModal v-model="isOpen" title="Título">contenido</UIModal>
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface Props {
  modelValue?: boolean
  title?: string
  size?: ModalSize
  persistent?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  size: 'md',
  persistent: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: [data?: unknown]
}>()

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

function close(data?: unknown): void {
  emit('update:modelValue', false)
  emit('close', data)
}

onMounted(() => {
  const handler = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && !props.persistent) close()
  }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <div
    class="w-full rounded-2xl bg-surface shadow-lg"
    :class="sizeClasses[size]"
  >
    <div
      v-if="title || $slots.header"
      class="flex items-center justify-between border-b border-border px-5 py-4"
    >
      <slot name="header">
        <h2 class="text-[15px] font-semibold tracking-tight text-text">
          {{ title }}
        </h2>
      </slot>
      <button
        class="flex h-7 w-7 items-center justify-center rounded-lg text-muted transition hover:bg-muted-bg hover:text-text"
        aria-label="Cerrar"
        @click="close()"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="px-5 py-4">
      <slot />
    </div>

    <div
      v-if="$slots.footer"
      class="flex items-center justify-end gap-2 border-t border-border px-5 py-4"
    >
      <slot name="footer" :close="close" />
    </div>
  </div>
</template>
