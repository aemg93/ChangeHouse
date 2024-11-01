<template>
  <div class="container">
    <img src="src/assets/logoDivisas.svg" alt="Cambio de Divisas">
    <h6 class="marg">Cambio de Divisas</h6>

    <input
      v-model.number="amount"
      placeholder="Cantidad a convertir"
      type="number"
      min="0"
      class="q-input"
    />
    <div>
      <i class="las la-angle-down"></i>
    </div>

    <q-select
      v-model="currencyFrom"
      :options="options"
      class="select"
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

    <q-btn @click="convertCurrency" :disabled="loading || !validAmount" class="button" label="Convertir" />
    <p v-if="loading" class="loading">Convirtiendo...</p>
    <p v-if="!loading && result !== null" class="result">Resultado: {{ result }}</p>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useCurrencyStore } from 'src/store/currencyStore';

const amount = ref(0);
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
const options = computed(() => Object.keys(rates.value).map(currency => ({ label: currency, value: currency })));

// Filtra las opciones para el segundo select
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
</script>

<style scoped>
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

</style>
