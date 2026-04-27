<script setup lang="ts">
interface Props {
  modelValue?: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  hint?: string
  disabled?: boolean
  required?: boolean
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="flex flex-col gap-1.5">
    <label v-if="label" class="text-sm font-medium text-text">
      {{ label }}
      <span v-if="required" class="text-error ml-0.5">*</span>
    </label>

    <input
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      class="h-9 w-full rounded-lg border bg-surface px-3 text-sm text-text outline-none transition placeholder:text-faint disabled:cursor-not-allowed disabled:opacity-50"
      :class="error
        ? 'border-error focus:border-error focus:shadow-[0_0_0_3px_var(--color-error-bg)]'
        : 'border-border focus:border-primary focus:shadow-primary'"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" class="text-xs text-error">{{ error }}</p>
    <p v-else-if="hint" class="text-xs text-muted">{{ hint }}</p>
  </div>
</template>
