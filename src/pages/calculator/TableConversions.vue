<template>
  <div>
    <h1>Conversor de Divisas</h1>
    <q-btn @click="fetchRates" label="Actualizar Tasas" />
    <div v-if="loading">Cargando tasas de cambio...</div>
    <div v-else-if="conversionError">{{ conversionError }}</div>
    <div v-else>
      <input type="number" v-model="amount" placeholder="Monto" />
      <select v-model="fromCurrency" :disabled="isLoadingOrNoRates">
        <option v-for="currency in currencyOptions" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <select v-model="toCurrency" :disabled="isLoadingOrNoRates">
        <option v-for="currency in currencyOptions" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <button @click="convertCurrency">Convertir</button>
      <div v-if="convertedAmount !== null">
        <p>{{ amount }} {{ fromCurrency }} = {{ convertedAmount }} {{ toCurrency }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useCurrencyStore } from 'src/store/currencyStore';

export default {
  setup() {
    const currencyStore = useCurrencyStore();
    const {rates, loading, fetchRates} = currencyStore;

    const amount = ref(0);
    const fromCurrency = ref('USD');
    const toCurrency = ref('EUR');
    const convertedAmount = ref(null);
    const conversionError = ref(null);

    const isLoadingOrNoRates = computed(() => loading.value || !Object.keys(rates.value).length);
    const currencyOptions = computed(() => Object.keys(rates.value));

    const getConversionRate = () => {
      if (!rates.value[fromCurrency.value] || !rates.value[toCurrency.value]) {
        conversionError.value = 'Tasas no disponibles o divisas no válidas.';
        return null;
      }
      conversionError.value = null; // Clear previous error
      return rates.value[toCurrency.value] / rates.value[fromCurrency.value];
    };

    const convertCurrency = () => {
      if (amount.value <= 0) {
        conversionError.value = 'Por favor, ingresa un monto válido.';
        return;
      }
      const rate = getConversionRate();
      if (rate) {
        convertedAmount.value = (amount.value * rate).toFixed(2);
      }
    };

    onMounted(() => {
      fetchRates();
    });

    return {
      rates,
      loading,
      fetchRates,
      amount,
      fromCurrency,
      toCurrency,
      convertCurrency,
      convertedAmount,
      conversionError,
      isLoadingOrNoRates,
      currencyOptions,
    };
  },
};
</script>
