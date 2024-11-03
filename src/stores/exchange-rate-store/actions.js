import apiAdapter from '@/adapters/apiAdapter';
import { getToday } from '@/helpers/date-utils'

export const actions = {
  async fetchExchangeRate({ source, target, date = null }) {
    date = date || getToday();
    const rate = await apiAdapter.fetchExchangeRate(source, target, date);
    this.exchangeRate = rate.data.exchange_rate;
  },
  async fetchParallelRate({ source, target, date = null }) {
    date = date || getToday();
    const rate = await apiAdapter.fetchParallelRate(source, target, date);
    this.parallelRate = rate.data.exchange_rate;
  }
};
