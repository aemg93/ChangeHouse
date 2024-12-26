<template>
  <AppSpinnerOverlay />
  <router-view />
</template>

<script setup>
import AppSpinnerOverlay from './components/AppSpinnerOverlay.vue';
import { useQuasar } from 'quasar';
const $q = useQuasar();


defineOptions({
  name: 'App',
  components: {
    AppSpinnerOverlay
  },
  mounted() {
    this.$q.notify({
      message: 'Disfruta de nuestra app totalmente gratis y sin publicidad.',
      color: 'positive',
      position: 'top',
      timeout: 3500,
      icon: 'emoji_emotions',
      classes: 'custom-notify-initial',
    });
  },
});
</script>

<style>
.q-page {
  min-height: calc(100vh - 300px) !important;
}
.custom-notify-initial {
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}
</style>
