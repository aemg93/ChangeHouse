import { defineStore } from 'pinia';
import { state } from './state';
import { getters } from './getters';
import { mutations } from './mutations';
import { actions } from './actions';

export const useCurrencyStore = defineStore({
  id: 'currencyStore',
  state,
  getters,
  actions
});
