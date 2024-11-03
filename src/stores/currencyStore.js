import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useCurrencyStore = defineStore('currency', () => {
  const rates = ref(JSON.parse(localStorage.getItem('currencyRates')) || {});
  const loading = ref(false);
  const error = ref('');

  const fetchRates = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      rates.value = data.rates;
      localStorage.setItem('currencyRates', JSON.stringify(rates.value));
    } catch (err) {
      error.value = 'No se pudo cargar las tasas. Intenta de nuevo más tarde.';
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    if (Object.keys(rates.value).length === 0) {
      fetchRates();
    }
  });

  const convertCurrency = (amount, currencyFrom, currencyTo) => {
    if (!rates.value[currencyFrom] || !rates.value[currencyTo]) {
      throw new Error('Currency not supported');
    }

    const amountInUSD = amount / rates.value[currencyFrom];
    const convertedAmount = amountInUSD * rates.value[currencyTo];

    return parseFloat(convertedAmount.toFixed(2));
  };

  return { rates, loading, error, fetchRates, convertCurrency };
});
