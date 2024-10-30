<template>
  <q-page class="flex flex-center text-center bg-dark">
    <div class=" flex-column text-white">
      <h1>Calculator</h1>
      <div>
        <MyModal />

      </div>
    </div>
  </q-page>
</template>

<script setup>

import MyModal from 'src/pages/calculator/MyModal.vue';
defineOptions({
  name: 'MyCalculator',
});
</script>
