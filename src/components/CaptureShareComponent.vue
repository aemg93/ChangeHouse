<template>
    <q-btn
      icon="las la-share-alt-square"
      class="share-btn q-px-sm"
      @click="captureAndShare"
    />
</template>

<script>
const appName = process.env.APP_NAME;

export default {
  methods: {
    captureAndShare() {
      if (navigator.screenshot && window.plugins.socialsharing) {
        navigator.screenshot.URI((error, res) => {
          if (error) {
            this.$q.notify({
              type: 'negative',
              message: 'Error al capturar la pantalla: ' + error,
            });
          } else {
            const imageDataUrl = res.URI;

            window.plugins.socialsharing.share(
              `Aquí tienes una cotización de divisas obtenida a través de ${appName}`,
              'Captura de pantalla',
              imageDataUrl,
              null
            );
          }
        }, 80);
      } else {
        this.$q.notify({
          type: 'warning',
          message: 'Los plugins necesarios no están disponibles en este entorno.',
        });
      }
    }
  },
};
</script>

<style scoped>
.share-btn {
  background-color: #FFC107;
  color: #000000;
}
</style>
