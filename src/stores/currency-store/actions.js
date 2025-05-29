import apiAdapter from '@/adapters/apiAdapter';

export const actions = {
  async fetchCurrencies(state) {
    try {
      const currencies = await apiAdapter.fetchCurrencies();
      this.currencies = currencies.data;
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  }
};
