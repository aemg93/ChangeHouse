<template>
  <q-input
    filled
    type="number"
    :min="0.01"
    v-model="temporaryValue"
    :rules="appliedRules"
    class="q-mt-sm"
    input-class="text-right"
    label="Monto"
    @focus="clearTemporaryValue"
    @blur="checkEmptyValue"
  />
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
});

const emit = defineEmits(["update:modelValue"]);

const temporaryValue = ref(String(props.modelValue));

const isFocused = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    if (!isFocused.value && newValue !== parseFloat(temporaryValue.value)) {
      temporaryValue.value = String(newValue);
    }
  }
);

const clearTemporaryValue = () => {
  isFocused.value = true;
  temporaryValue.value = "";
};

watch(
  () => temporaryValue.value,
  (newValue) => {
    if (newValue.trim() === "") {
      emit("update:modelValue", 1);
    } else {
      const parsedValue = parseFloat(newValue);
      if (!isNaN(parsedValue)) {
        emit("update:modelValue", parsedValue);
      }
    }
  }
);

const checkEmptyValue = () => {
  isFocused.value = false;

  if (temporaryValue.value.trim() === "") {
    temporaryValue.value = "1";
    emit("update:modelValue", 1);
  }
};

const appliedRules = ref([
  (val) => {
    if (!isFocused.value) {
      return parseFloat(val) >= 0.01 || "El monto debe ser mayor o igual a 0.01";
    }
    return true;
  },
]);
</script>
