<template>
  <q-item
    clickable
    tag="router-link"
    :to="{ name: props.link }"
    :class="{ 'active-link': isActive }"
  >
  <q-item-section
    v-if="props.icon"
    avatar
  >
    <q-icon :name="props.icon" />
  </q-item-section>

  <q-item-section>
    <q-item-label>{{ props.title }}</q-item-label>
    <q-item-label caption>{{ props.caption }}</q-item-label>
  </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'EssentialLink'
})

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ''
  },
  link: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    default: ''
  },
})

const route = useRoute()
const isActive = computed(() => route.name === props.link);
</script>

<style scoped>
.active-link {
  background-color: #080808 !important;
  color: #40fd05 !important;
}
</style>
