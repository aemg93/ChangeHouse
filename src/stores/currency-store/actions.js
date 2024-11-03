import apiAdapter from '@/adapters/apiAdapter';

export const actions = {
  async fetchCurrencies(state) {
    try {
      this.currencies = await apiAdapter.fetchCurrencies();
    } catch (error) {
      console.error("Error al obtener las monedas:", error);
    }
  }
};
