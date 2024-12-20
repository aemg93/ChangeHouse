<template>
  <q-page>
    <div class="q-mt-md q-mx-auto text-center" style="max-width: 70%; width: 100%;">
      <div class="text-center q-mb-md q-mt-lg">
        <img src="@/assets/logo.svg" alt="Equivalencia de Divisas" />
        <h6 class="q-ma-none">Equivalencia de Divisas</h6>
      </div>
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
