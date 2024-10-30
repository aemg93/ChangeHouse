import { defineStore } from 'pinia';
import { ref, onMounted } from 'vue';

export const useCurrencyStore = defineStore('currency', () => {
  const rates = ref(JSON.parse(localStorage.getItem('currencyRates')) || {});
  const loading = ref(false);
  const error = ref(null);

  const fetchRates = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      rates.value = data.rates; // Almacena las tasas de cambio
      localStorage.setItem('currencyRates', JSON.stringify(rates.value)); // Guarda en local storage
    } catch (err) {
      error.value = 'No se pudo cargar las tasas. Intenta de nuevo más tarde.';
    } finally {
      loading.value = false;
    }
  };

  // Intenta cargar las tasas del local storage al montar el componente
  onMounted(() => {
    if (Object.keys(rates.value).length === 0) {
      fetchRates();
    }
  });

  return { rates, loading, error, fetchRates };
});
