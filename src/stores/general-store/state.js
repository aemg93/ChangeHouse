import { ref } from 'vue';

export const state = () => ({
  rates: ref(JSON.parse(localStorage.getItem('currencyRates')) || {})
});
