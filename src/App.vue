<template>
  <AppSpinnerOverlay />
  <router-view />

  <q-dialog v-model="showOfflineDialog" persistent>
    <q-card class="text-red text-center">
      <q-card-section>
        <div class="text-h6 text-negative">¡Sin conexión a internet!</div>
      </q-card-section>
      <q-card-section>
        <p>
          La aplicación necesita una conexión a internet para funcionar adecuadamente.
          Por favor, verifica tu conexión WiFi o de datos móviles y vuelve a intentarlo.
        </p>
      </q-card-section>
      <q-card-section>
        <q-btn
          label="Cerrar aplicación"
          color="negative"
          unelevated
          @click="closeApp"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed } from 'vue';
import { useNetworkStatus } from './composables/useNetworkStatus';
import AppSpinnerOverlay from './components/AppSpinnerOverlay.vue';

const { isOnline } = useNetworkStatus();

const showOfflineDialog = computed(() => !isOnline.value);

const closeApp = () => {
  if (navigator.app && navigator.app.exitApp) {
    navigator.app.exitApp();
  } else if (typeof window !== 'undefined') {
    window.close();
  } else {
    console.error('No se puede cerrar la aplicación en este entorno.');
  }
};

defineOptions({
  name: 'App',
  components: {
    AppSpinnerOverlay
  }
});
</script>

<style>
.q-page {
  min-height: calc(100vh - 300px) !important;
}
</style>
