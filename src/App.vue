<template>
  <AppSpinnerOverlay />
  <router-view />
</template>

<script setup>
import AppSpinnerOverlay from './components/AppSpinnerOverlay.vue';


defineOptions({
  name: 'App',
  components: {
    AppSpinnerOverlay
  },
});
</script>

<style>
.q-page {
  min-height: calc(100vh - 300px) !important;
}
</style>
