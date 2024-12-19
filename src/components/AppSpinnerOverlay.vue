<template>
  <div
    v-if="generalStore.loading"
    class="overlay"
  >
    <q-spinner-radio color="blue" size="3em" />
  </div>
</template>

<script setup>
import { useGeneralStore } from '@/stores/general-store';

const generalStore = useGeneralStore();
</script>

<style scoped>
.overlay {
  position: fixed; /* Fija el fondo */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8); /* Fondo blanco translúcido */
  display: flex;
  justify-content: center; /* Centrado horizontal */
  align-items: center; /* Centrado vertical */
  z-index: 9999; /* Para estar encima de todo */
}
</style>
