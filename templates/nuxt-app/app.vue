<script setup lang="ts">
import ModalHost from '~/components/ui/ModalHost.vue'
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <!-- ModalHost debe ir fuera del NuxtLayout para no heredar z-index ni overflow -->
  <ModalHost />
</template>
