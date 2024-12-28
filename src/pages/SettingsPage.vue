<template>
  <q-page class="flex flex-center">
    <div style="max-width: 400px; width: 100%; padding: 20px;">
      <h6 class="text-center">Configuración</h6>

      <p class="description q-mt-md">Configura tus monedas iniciales para la conversión.</p>

      <CurrencySelect
        v-model="currencyFrom"
        :options="filteredOptionsFrom"
        label="Moneda de origen"
        :rules="[validateCurrencies]"
        :filter-handler="filterFrom"
        @update:model-value="(value) => handleCurrencySelection(value, 'from')"
      />

      <CurrencySelect
        v-model="currencyTo"
        :options="filteredOptionsTo"
        label="Moneda de destino"
        :rules="[validateCurrencies]"
        :filter-handler="filterTo"
        @update:model-value="(value) => handleCurrencySelection(value, 'to')"
      />

      <q-btn
        label="Guardar configuración"
        color="primary"
        unelevated
        class="q-mt-lg full-width"
        :disable="!isValid"
        @click="saveSettings"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency-store';
import CurrencySelect from '@/components/CurrencySelect.vue';
import { useExchangeRateStore } from '@/stores/exchange-rate-store';
import useCurrencySelection from '@/composables/useCurrencySelection';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const currencyStore = useCurrencyStore();
const exchangeRateStore = useExchangeRateStore();
const {
  currencyFrom,
  currencyTo,
  filteredOptionsFrom,
  filteredOptionsTo,
  loadSettings,
  handleCurrencySelection,
  filterFrom,
  filterTo
} = useCurrencySelection(currencyStore);

const validateCurrencies = () => {
  if (!currencyFrom.value || !currencyTo.value) {
    return "Debe seleccionar ambas monedas.";
  }
  if (currencyFrom.value === currencyTo.value) {
    return "Las monedas deben ser diferentes.";
  }
  return true;
};

const saveSettings = () => {
  const exchangeRate = JSON.parse(localStorage.getItem('default_exchange_rate'));
  const parallelRate = JSON.parse(localStorage.getItem('default_parallel_rate'));
  const fromCurrency = localStorage.getItem('currencyFrom') || 'USD';
  const toCurrency = localStorage.getItem('currencyTo') || 'VES';

  if (
    exchangeRate &&
    (
      (exchangeRate.data.source_currency === fromCurrency && exchangeRate.data.target_currency === toCurrency) ||
      (exchangeRate.data.source_currency === toCurrency && exchangeRate.data.target_currency === fromCurrency)
    )
  ) {
    localStorage.removeItem('default_exchange_rate');
  }

  if (
    parallelRate &&
    (
      (parallelRate.data.source_currency === fromCurrency && parallelRate.data.target_currency === toCurrency) ||
      (parallelRate.data.source_currency === toCurrency && parallelRate.data.target_currency === fromCurrency)
    )
  ) {
    localStorage.removeItem('default_parallel_rate');
  }

  const from = currencyFrom.value;
  const to = currencyTo.value;

  localStorage.setItem('currencyFrom', from);
  localStorage.setItem('currencyTo', to);

  if (from !== fromCurrency || to !== toCurrency) {
    exchangeRateStore.setExchangeRate(0);
    exchangeRateStore.setParallelRate(0);
  }

  $q.notify({
    type: 'warning',
    message: 'Configuración guardada exitosamente.',
    position: 'top',
    timeout: 3000,
    actions: [{ icon: 'close', color: 'black' }]
  });
};

const isValid = computed(() => validateCurrencies() === true);

onMounted(async () => {
  await currencyStore.fetchCurrencies(); // Asegúrate de que las monedas estén cargadas
  loadSettings();
});
</script>

<style scoped>
.description {
  text-align: center;
}

.full-width {
  width: 100%;
}
</style>
