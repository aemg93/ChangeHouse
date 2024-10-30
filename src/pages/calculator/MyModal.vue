<template>
  <q-page>
 <div>hola</div>
    <TableConversions />
  </q-page>
</template>

<script>
import TableConversions from "pages/calculator/TableConversions.vue";
import {defineComponent} from "vue";

export default defineComponent({
  components: {TableConversions}
})

</script>

<style scoped>
.conversion-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
