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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}
</style>
