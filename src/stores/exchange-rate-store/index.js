import { defineStore } from 'pinia';
import { state } from './state';
import { getters } from './getters';
import { actions } from './actions';

export const useExchangeRateStore = defineStore({
  id: 'exchangeRateStore',
  state,
  getters,
  actions
});
