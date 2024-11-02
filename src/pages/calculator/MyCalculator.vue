<template>
  <q-page>
  <div class="text-center q-mt-xl">
    <img src="src/assets/logoDivisas.svg" alt="Cambio de Divisas">
    <h6 class="q-ma-none">Cambio de Divisas</h6>
    <TableConversions />
  </div>
  </q-page>
</template>
<script>
import TableConversions from "pages/calculator/TableConversions.vue";
export default {
  components: {TableConversions}
}
</script>

<style scoped>

</style>
