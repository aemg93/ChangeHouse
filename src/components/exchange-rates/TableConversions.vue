<template>
  <q-page>
    <div class="container">
      <div style="max-width: 100%">

        <q-input
          filled
          v-model="date"
          mask="date"
          :rules="['date']"
          input-class=""
        >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="dateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date
                  v-model="date"
                  @update:model-value="dateProxy.hide()"
                  :options="disableFutureDates"
                >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>

        <q-input
          filled
          v-model.number="amount"
          label="Monto"
          fill-mask="0"
          reverse-fill-mask
          input-class="text-right "
          @input="validateInput"
        />

        <q-select
          v-model="currencyFrom"
          :options="filteredOptionsFrom"
          use-input
          input-debounce="0"
          class="select q-mt-sm "
          filled
          label="Moneda de origen"
          emit-value
          map-options
          dropdown-icon="las la-angle-down"
          input-class=""
          @filter="filterFrom"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section>
                No hay resultados disponibles
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <q-select
          v-model="currencyTo"
          :options="filteredOptionsTo"
          use-input
          input-debounce="0"
          class="select q-mt-sm "
          filled
          label="Moneda destino"
          emit-value
          map-options
          dropdown-icon="fas las la-angle-down"
          input-class=""
          @filter="filterTo"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section>
                No hay resultados disponibles
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <div class="q-mt-md q-mb-md result">
        <div v-if="!generalStore.loading && result !== null" class="result ">{{ `${currencyFormat(amount, currencyFrom)}` }}</div>
        <div v-if="!generalStore.loading && result !== null" class="result ">Equivale a</div>
        <div v-if="generalStore.error" class="error ">{{ generalStore.error }}</div>
      </div>

      <q-card dark bordered class="bg-positive text-dark my-card">
        <q-card-section>
          <div class="text-subtitle2 " v-if="showParallelRate">Equivalencia oficial</div>
          <div v-if="!generalStore.loading && result !== null" class="result ">{{ `${currencyFormat(result, currencyTo)}` }}</div>
        </q-card-section>
        <q-separator dark inset v-if="showParallelRate" />
        <q-card-section v-if="showParallelRate">
          <div class="text-subtitle2 ">Equivalencia paralela</div>
          <div v-if="!generalStore.loading && result !== null" class="result ">{{ `${currencyFormat(parallelResult, currencyTo)}` }}</div>
        </q-card-section>
      </q-card>
      <div v-if="!generalStore.loading && result !== null" class="result q-mt-md ">Resultado de la conversión: de {{ nameCurrencyFrom }} a {{ nameCurrencyTo }}</div>

    </div>
  </q-page>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useCurrencyStore } from '@/stores/currency-store';
import { useExchangeRateStore } from '@/stores/exchange-rate-store';
import { useGeneralStore } from '@/stores/general-store';
import { currencyFormat } from "@/helpers/currency-utils";
import { getTodayForCalendar } from '@/helpers/date-utils';

// Initial status
const amount = ref(1);
const currencyFrom = ref('USD');
const currencyTo = ref('VES');
const result = ref(0);
const parallelResult = ref(0);
const date = ref(getTodayForCalendar());
const dateProxy = ref(null);
const searchFrom = ref('');
const searchTo = ref('');
const currencyStore = useCurrencyStore();
const exchangeRateStore = useExchangeRateStore();
const generalStore = useGeneralStore();

// Disable future dates
const disableFutureDates = (inputDate) => inputDate <= getTodayForCalendar();

// Remove accents from a string
const removeAccents = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// Computed properties
const options = computed(() =>
  currencyStore.getCurrencies.map(currency => ({
    label: currency.name,
    value: currency.code
  }))
);

const showParallelRate = computed(() => currencyFrom.value === 'VES' || currencyTo.value === 'VES');

const filteredOptionsFrom = computed(() => {
  return options.value.filter(option => {
    const label = removeAccents(option.label.toLowerCase());
    const search = removeAccents(searchFrom.value.toLowerCase());
    return option.value !== currencyTo.value && label.includes(search);
  });
});

const filteredOptionsTo = computed(() => {
  return options.value.filter(option => {
    const label = removeAccents(option.label.toLowerCase());
    const search = removeAccents(searchTo.value.toLowerCase());
    return option.value !== currencyFrom.value && label.includes(search);
  });
});

// Computed properties for symbols and coin names
const getCurrencyProperty = (currencyCode, property) => {
  const currency = currencyStore.getCurrencies.find(currency => currency.code === currencyCode);
  return currency ? currency[property] : currencyCode;
};

const symbolCurrencyFrom = computed(() => getCurrencyProperty(currencyFrom.value, 'symbol'));
const symbolCurrencyTo = computed(() => getCurrencyProperty(currencyTo.value, 'symbol'));
const nameCurrencyFrom = computed(() => getCurrencyProperty(currencyFrom.value, 'name'));
const nameCurrencyTo = computed(() => getCurrencyProperty(currencyTo.value, 'name'));

// Filter for search inputs
const filterFrom = (val, update) => {
  searchFrom.value = val;
  update();
};

const filterTo = (val, update) => {
  searchTo.value = val;
  update();
};

// Update of conversion results
const updateResults = () => {
  const rate = exchangeRateStore.getExchangeRate;
  const parallelRate = exchangeRateStore.getParallelRate;
  result.value = amount.value && rate ? parseFloat((amount.value * rate).toFixed(4)) : 0;
  parallelResult.value = amount.value && parallelRate ? parseFloat((amount.value * parallelRate).toFixed(4)) : 0;
};

//Initial assembly
onMounted(async () => {
  await currencyStore.fetchCurrencies();
  await exchangeRateStore.fetchExchangeRate({ source: currencyFrom.value, target: currencyTo.value });
  if (showParallelRate.value) {
    await exchangeRateStore.fetchParallelRate({ source: currencyFrom.value, target: currencyTo.value });
  }
});

// Reactive observers
watch([currencyFrom, currencyTo, date], async () => {
  if (currencyFrom.value && currencyTo.value && date.value) {
    await exchangeRateStore.fetchExchangeRate({ source: currencyFrom.value, target: currencyTo.value, date: date.value });
    if (showParallelRate.value) {
      await exchangeRateStore.fetchParallelRate({ source: currencyFrom.value, target: currencyTo.value, date: date.value });
    }
  }
});

watch([amount, () => exchangeRateStore.getExchangeRate, () => exchangeRateStore.getParallelRate], updateResults);

// Validate the input of the amount
const validateInput = (event) => {
  const value = event.target.value;
  const sanitizedInput = value.replace(/[^0-9.]/g, '');
  amount.value = sanitizedInput ? parseFloat(sanitizedInput) : 0;
};
</script>
<style scoped>
.my-card
.result{
  font-size: 15px;
  font-weight: bold;
  font-family: DialogInput;
}
</style>

