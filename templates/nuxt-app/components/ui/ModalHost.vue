<script setup lang="ts">
const { modalStack, close } = useModal()

function handleBackdropClick(index: number): void {
  // Solo cierra si es el modal más al frente del stack
  if (index === modalStack.value.length - 1) {
    close()
  }
}
</script>

<template>
  <Teleport to="body">
    <TransitionGroup name="modal-backdrop">
      <div
        v-for="(modal, index) in modalStack"
        :key="index"
        class="fixed inset-0 flex items-center justify-center p-4"
        :style="{ zIndex: 50 + index * 10, backgroundColor: 'rgba(0,0,0,0.45)' }"
        @click.self="handleBackdropClick(index)"
      >
        <component
          :is="modal.component"
          v-bind="modal.props"
          class="modal-panel"
          @close="close"
        />
      </div>
    </TransitionGroup>
  </Teleport>
</template>

<style scoped>
.modal-backdrop-enter-active {
  transition: opacity 0.2s ease;
}
.modal-backdrop-leave-active {
  transition: opacity 0.15s ease;
}
.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

@keyframes modal-slide-up {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-panel {
  animation: modal-slide-up 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
