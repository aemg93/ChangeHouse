<template>
  <q-page>
  <div class="">
    <input
      v-model.number="amount"
      placeholder="Cantidad a convertir"
      type="number"
      min="0"
      class="q-input"
      @input="validateInput"
    />
    <q-select
      v-model="currencyFrom"
      :options="options"
      class="select text-white q-mx-auto"
      filled
      label="Selecciona de"
      emit-value
      map-options
      dropdown-icon="las la-angle-down"
    />

    <q-select
      v-model="currencyTo"
      :options="filteredOptions"
      class="select"
      filled
      label="Selecciona a"
      emit-value
      map-options
      dropdown-icon="fas las la-angle-down"
    />

    <q-btn @click="convertCurrency" :disabled="loading || !validAmount || !currencyFrom || !currencyTo"  class="button " label="Convertir" />
    <p v-if="loading" class="loading ">Convirtiendo...</p>
    <p v-if="!loading && result !== null" class="result">Resultado: {{ result }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
  </q-page>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCurrencyStore } from 'src/store/currencyStore';

const amount = ref(1);
const currencyFrom = ref('');
const currencyTo = ref('');
const result = ref(null);
const store = useCurrencyStore();
const loading = store.loading;
const errorMessage = ref(store.error);

const validAmount = computed(() => amount.value > 0);

const fetchRates = async () => {
  await store.fetchRates();
};
fetchRates();

const rates = computed(() => store.rates);
const options = computed(() => Object.keys(rates.value).map(currency =>
  ({ label: currency, value: currency })));


const filteredOptions = computed(() => {
  return options.value.filter(option => option.value !== currencyFrom.value);
});

const convertCurrency = () => {
  try {
    result.value = store.convertCurrency(amount.value, currencyFrom.value, currencyTo.value);
  } catch (error) {
    errorMessage.value = error.message;
  }
};
const validateInput = (event) => {
  const value = event.target.value;
  const sanitizedInput = value.replace(/[^0-9.]/g, '');
  amount.value = sanitizedInput ? parseFloat(sanitizedInput) : 0;
};
</script>

<style scoped>

input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="number"] {
  -moz-appearance: textfield;
}
.q-input {
  border: none;
  border-bottom: 2px solid #03ff03;
  outline: none;
  background: transparent;
  color: #03ff03;
  font-size: 16px;
  text-align: right;
}

.q-input:focus {
  border-bottom: 2px solid #03ff03;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.q-input,
.select,
.button {
  margin: 10px 0;
  width: 200px;
}

.loading,
.result,
.error {
  margin-top: 10px;
}
.select {
  border: none;
  background: transparent;
  color: #03ff03;
  border-bottom: 2px solid #03ff03;
  margin: 0 auto
}


</style>
