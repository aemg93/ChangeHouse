<template>
  <q-page>
    <div class="text-center q-mt-xl">
      <img src="@/assets/logoDivisas.svg" alt="Cambio de Divisas">
      <h6 class="q-ma-none">Cambio de Divisas</h6>
      <TableConversions />
    </div>
  </q-page>
</template>

<script setup>
import TableConversions from "components/exchange-rates/TableConversions.vue";

defineOptions({
  name: 'IndexPage'
});
</script>
