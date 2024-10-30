<template>
  <div>
    <h1>Conversor de Divisas</h1>
    <q-btn @click="fetchRates" label="Actualizar Tasas" />
    <div v-if="loading">Cargando tasas de cambio...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <input type="number" v-model="amount" placeholder="Monto" />
      <select v-model="fromCurrency" :disabled="loading || error">
        <option v-for="(rate, currency) in rates" :key="currency" :value="currency">
          {{ currency }}
        </option>
      </select>
      <select v-model="toCurrency" :disabled="loading || error">
        <option v-for="(rate, currency) in rates" :key="currency" :value="currency">
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
import { ref, onMounted } from 'vue';
import { useCurrencyStore } from 'src/store/currencyStore';

export default {
  setup() {
    const currencyStore = useCurrencyStore();
    const { rates, loading, error, fetchRates } = currencyStore;

    const amount = ref(0);
    const fromCurrency = ref('USD');
    const toCurrency = ref('EUR');
    const convertedAmount = ref(null);

    const convertCurrency = () => {
      if (!rates.value || !rates.value[fromCurrency.value] || !rates.value[toCurrency.value]) {
        console.error('Tasas no disponibles o divisas no válidas.');
        return;
      }
      const conversionRate = rates.value[toCurrency.value] / rates.value[fromCurrency.value];
      convertedAmount.value = (amount.value * conversionRate).toFixed(2);
    };

    onMounted(() => {
      fetchRates();
    });

    return { rates, loading, error, fetchRates, amount, fromCurrency, toCurrency, convertCurrency, convertedAmount };
  },
};
</script>
