<template>
  <q-page>
    <div class="q-mt-xl q-mx-auto text-center" style="max-width: 70%; width: 100%;">
      <div class="text-center">
        <img src="@/assets/logoDivisas.svg" alt="Cambio de Divisas" />
        <h6 class="q-ma-none">Cambio de Divisas</h6>
      </div>
      <TableConversions />
    </div>
  </q-page>z
</template>

<script setup>
import TableConversions from "components/exchange-rates/TableConversions.vue";

defineOptions({
  name: 'IndexPage'
});
</script>
