<template>
  <q-select
    v-model="localValue"
    :options="options"
    :use-input="useInput"
    input-debounce="0"
    :filled="filled"
    :label="label"
    :emit-value="emitValue"
    :map-options="mapOptions"
    :rules="rules"
    class="select"
    @filter="handleFilter"
    @update:model-value="handleSelect"
  >
    <template v-slot:no-option>
      <q-item>
        <q-item-section>No hay resultados disponibles</q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, required: true },
  options: { type: Array, default: () => [] },
  label: { type: String, required: true },
  rules: { type: Array, default: () => [] },
  useInput: { type: Boolean, default: true },
  filled: { type: Boolean, default: true },
  emitValue: { type: Boolean, default: true },
  mapOptions: { type: Boolean, default: true },
  filterHandler: { type: Function, default: null }
});

const emit = defineEmits(['update:modelValue']);

const localValue = ref(props.modelValue);

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

watch(
  localValue,
  (newValue) => {
    emit('update:modelValue', newValue);
  }
);

const handleFilter = (val, update) => {
  if (props.filterHandler) {
    props.filterHandler(val, update);
  } else {
    update();
  }
};

const handleSelect = () => {
  const el = document.activeElement;
  if (el) {
    el.blur();
  }
};

</script>

<style scoped>
.select {
  margin-top: 16px;
}
</style>
