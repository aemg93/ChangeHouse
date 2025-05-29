import { ref, computed } from 'vue';

export default function useCurrencySelection(currencyStore) {
  const searchFrom = ref('');
  const searchTo = ref('');
  const currencyFrom = ref('USD');
  const currencyTo = ref('VES');
  const previousCurrencyFrom = ref(currencyFrom.value);
  const previousCurrencyTo = ref(currencyTo.value);

  const loadSettings = () => {
    const from = localStorage.getItem('currencyFrom') || 'USD';
    const to = localStorage.getItem('currencyTo') || 'VES';
    currencyFrom.value = from;
    currencyTo.value = to;
  };

  const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const options = computed(() =>
    currencyStore.getCurrencies.map(currency => ({
      label: currency.name,
      value: currency.code
    }))
  );

  const filteredOptionsFrom = computed(() => {
    return options.value.filter(option => {
      const label = removeAccents(option.label.toLowerCase());
      const search = removeAccents(searchFrom.value.toLowerCase());
      return label.includes(search);
    });
  });

  const filteredOptionsTo = computed(() => {
    return options.value.filter(option => {
      const label = removeAccents(option.label.toLowerCase());
      const search = removeAccents(searchTo.value.toLowerCase());
      return label.includes(search);
    });
  });

  const handleCurrencySelection = (selectedCurrency, target) => {
    searchFrom.value = '';
    searchTo.value = '';
    if (target === 'from') {
      if (selectedCurrency === currencyTo.value) {
        currencyTo.value = previousCurrencyFrom.value;
      }
      currencyFrom.value = selectedCurrency;
      previousCurrencyFrom.value = selectedCurrency;
    } else if (target === 'to') {
      if (selectedCurrency === currencyFrom.value) {
        currencyFrom.value = previousCurrencyTo.value;
      }
      currencyTo.value = selectedCurrency;
      previousCurrencyTo.value = selectedCurrency;
    }
  };

  const filterFrom = (val, update) => {
    searchFrom.value = val;
    update(() => {
      return options.value.filter(option => {
        const label = removeAccents(option.label.toLowerCase());
        const search = removeAccents(searchFrom.value.toLowerCase());
        return option.value !== currencyTo.value && label.includes(search);
      });
    });
  };

  const filterTo = (val, update) => {
    searchTo.value = val;
    update(() => {
      return options.value.filter(option => {
        const label = removeAccents(option.label.toLowerCase());
        const search = removeAccents(searchTo.value.toLowerCase());
        return option.value !== currencyFrom.value && label.includes(search);
      });
    });
  };

  return {
    currencyFrom,
    currencyTo,
    filteredOptionsFrom,
    filteredOptionsTo,
    loadSettings,
    handleCurrencySelection,
    filterFrom,
    filterTo,
  };
}
