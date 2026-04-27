<script setup lang="ts">
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] focus:shadow-[var(--shadow-primary)]',
  secondary: 'bg-[var(--color-surface)] text-[var(--color-text)] border border-[var(--color-border)] hover:bg-[var(--color-subtle-bg)] hover:border-[var(--color-border-strong)]',
  danger:    'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-text)]',
  ghost:     'text-[var(--color-muted)] hover:bg-[var(--color-muted-bg)] hover:text-[var(--color-text)]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-base gap-2',
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg font-medium transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    :class="[variantClasses[variant], sizeClasses[size]]"
    @click="emit('click', $event)"
  >
    <svg
      v-if="loading"
      class="animate-spin"
      :class="size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'"
      fill="none" viewBox="0 0 24 24"
    >
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
    </svg>
    <slot />
  </button>
</template>
