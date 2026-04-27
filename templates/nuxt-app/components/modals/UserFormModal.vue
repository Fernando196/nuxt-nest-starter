<script setup lang="ts">
/**
 * UserFormModal — ejemplo de modal programático.
 *
 * Se abre desde código así:
 *   const { openModal } = useModal()
 *   const saved = await openModal<boolean>(UserFormModal, { user: userToEdit })
 *
 * Emite @close(data?) para resolver la promesa en el caller.
 * Si emite close(true) → el caller sabe que guardó y puede refrescar.
 * Si emite close() o close(undefined) → canceló.
 */
interface User {
  id?: string
  name: string
  email: string
  role: 'admin' | 'user'
  active: boolean
}

interface Props {
  user?: User  // si viene → modo edición, si no → modo creación
}

const props = defineProps<Props>()
const emit = defineEmits<{ close: [saved?: boolean] }>()

const { post, put } = useApi()

const isSubmitting = ref<boolean>(false)
const error = ref<string | null>(null)

const form = ref<Omit<User, 'id'>>({
  name:   props.user?.name   ?? '',
  email:  props.user?.email  ?? '',
  role:   props.user?.role   ?? 'user',
  active: props.user?.active ?? true,
})

const isEditing = computed<boolean>(() => !!props.user?.id)
const title = computed<string>(() => isEditing.value ? 'Editar usuario' : 'Nuevo usuario')

async function handleSubmit(): Promise<void> {
  isSubmitting.value = true
  error.value = null
  try {
    if (isEditing.value) {
      await put(`/users/${props.user!.id}`, form.value)
    } else {
      await post('/users', form.value)
    }
    emit('close', true)  // true → guardó correctamente
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al guardar'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <!-- UIModal actúa como el panel; recibe @close del ModalHost -->
  <UIModal :title="title" size="md" @close="emit('close')">
    <form class="flex flex-col gap-4" @submit.prevent="handleSubmit">
      <UIInput
        v-model="form.name"
        label="Nombre"
        placeholder="Ej: Juan Pérez"
        required
      />
      <UIInput
        v-model="form.email"
        label="Email"
        type="email"
        placeholder="juan@empresa.com"
        required
      />

      <div class="flex flex-col gap-1.5">
        <label class="text-sm font-medium text-text">Rol</label>
        <select
          v-model="form.role"
          class="h-9 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text outline-none transition focus:border-primary focus:shadow-primary"
        >
          <option value="user">Usuario</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <label class="flex cursor-pointer items-center gap-2">
        <input
          v-model="form.active"
          type="checkbox"
          class="h-4 w-4 rounded accent-primary"
        />
        <span class="text-sm text-text">Usuario activo</span>
      </label>

      <p v-if="error" class="text-sm text-error">{{ error }}</p>
    </form>

    <template #footer="{ close }">
      <UIButton variant="secondary" @click="close()">Cancelar</UIButton>
      <UIButton :loading="isSubmitting" @click="handleSubmit">
        {{ isEditing ? 'Guardar cambios' : 'Crear usuario' }}
      </UIButton>
    </template>
  </UIModal>
</template>
