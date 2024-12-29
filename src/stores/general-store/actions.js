export const actions = {
  setLoading(value) {
    this.loading = value;
  },
  setError(message) {
    this.error = message;
  },
  setInitialLoad(value) {
    this.initialLoad = value;
  },
  setLastExecutionTime(value) {
    this.lastExecutionTime = value;
  },
  updateCurrentCurrencies(currencyFrom, currencyTo) {
    localStorage.setItem('currentCurrencyFrom', currencyFrom);
    localStorage.setItem('currentCurrencyTo', currencyTo);
  }
};
