<template>
  <q-page>
    <div class="container">
      <div style="max-width: 100%">
        <div class="row items-center justify-between">
          <div class="col">
            <q-input
              filled
              v-model="date"
              mask="date"
              :rules="['date']"
              input-class=""
              hint="Desde el 01/01/2000"
              persistent-hint
              label="Fecha"
              :input-style="{ fontSize: '1.2rem' }"
              readonly
              @click="openCalendar"
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="dateProxy" cover transition-show="scale" transition-hide="scale">
                    <q-date
                      v-model="date"
                      @update:model-value="dateProxy.hide()"
                      :options="disableDates"
                      :locale="locale"
                    >
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat></q-btn>
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col q-ml-sm">
            <AmountInput v-model="amount" />
          </div>
        </div>

        <div class="row no-wrap q-mt-md">
          <q-btn
            flat
            color="blue"
            class="col q-mr-xs btn-reset"
            @click="resetData"
          >
            <span>Res.</span>
            <q-icon name="refresh" class="q-ml-xs" />
            <q-tooltip :hide-delay="700" class="bg-blue text-white">
              Restableciendo
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            color="orange"
            class="col q-mx-xs btn-exchange"
            @click="exchangeCurrencies"
          >
            <span>Int.</span>
            <q-icon name="swap_horiz" class="q-ml-xs" />
            <q-tooltip :hide-delay="700" class="bg-orange text-white">
              Intercambiando
            </q-tooltip>
          </q-btn>

          <q-btn
            flat
            color="green"
            class="col q-ml-xs btn-refresh"
            @click="refreshResults"
          >
            <span>Act.</span>
            <q-icon name="update" class="q-ml-xs" />
            <q-tooltip :hide-delay="700" class="bg-green text-white">
              Actualizando
            </q-tooltip>
          </q-btn>
        </div>

        <CurrencySelect
          v-model="currencyFrom"
          :options="filteredOptionsFrom"
          label="Moneda de origen"
          :filter-handler="filterFrom"
          @update:model-value="(value) => handleCurrencySelection(value, 'from')"
        />

        <CurrencySelect
          v-model="currencyTo"
          :options="filteredOptionsTo"
          label="Moneda destino"
          :filter-handler="filterTo"
          @update:model-value="(value) => handleCurrencySelection(value, 'to')"
        />
      </div>

      <div class="q-mt-md q-mb-md result-label">
        <div v-if="!generalStore.loading && result !== null">{{ `${currencyFormat(amount, currencyFrom)}` }} equivale a</div>
      </div>

      <q-card dark bordered class="bg-positive text-dark my-card q-pt-md">
        <q-card-section class="show-result">
          <div class="text-subtitle2">Tasa {{ showParallelRate ? 'oficial BCV' : 'de Cambio'}}</div>
          <div v-if="!generalStore.loading && result !== null" class="result">{{ `${currencyFormat(result, currencyTo)}` }}</div>
        </q-card-section>
        <q-card-section class="show-result" v-if="showParallelRate">
          <div class="text-subtitle2">Tasa paralela</div>
          <div v-if="!generalStore.loading && parallelResult !== null" class="result">{{ `${currencyFormat(parallelResult, currencyTo)}` }}</div>
        </q-card-section>
        <q-card-section class="show-result" v-if="showParallelRate && averageRate !== null">
          <div class="text-subtitle2">Tasa promedio</div>
          <div class="result">{{ `${currencyFormat(averageRate, currencyTo)}` }}</div>
        </q-card-section>
        <div class="q-mb-sm"></div>
      </q-card>
      <div v-if="!generalStore.loading && result !== null" class="result q-mt-md">
        Resultado de la conversión: de {{ nameCurrencyFrom }} a {{ nameCurrencyTo }}
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onActivated, watch } from 'vue';
import { debounce } from 'lodash';
import { useCurrencyStore } from '@/stores/currency-store';
import { useExchangeRateStore } from '@/stores/exchange-rate-store';
import { useGeneralStore } from '@/stores/general-store';
import { currencyFormat } from '@/helpers/currency-utils';
import { getTodayForCalendar, getMinDateForCalendar } from '@/helpers/date-utils';
import AmountInput from '@/components/exchange-rates/AmountInput.vue';
import CurrencySelect from '@/components/CurrencySelect.vue';
import useCurrencySelection from '@/composables/useCurrencySelection';
import { useQuasar } from 'quasar';

// Initial status
const amount = ref(1);
const result = ref(0);
const parallelResult = ref(0);
const date = ref(getTodayForCalendar());
const dateProxy = ref(null);

const isInitialized = ref(false);

const currencyStore = useCurrencyStore();
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
const exchangeRateStore = useExchangeRateStore();
const generalStore = useGeneralStore();
const $q = useQuasar();

const locale = ref({
  days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
  daysShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
  monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
  firstDayOfWeek: 1,
  format24h: true,
  pluralDay: 'dias',
});

const openCalendar = () => {
  dateProxy.value.show();
};

const disableDates = (inputDate) => {
  const minDate = getMinDateForCalendar();
  const maxDate = getTodayForCalendar();
  return inputDate >= minDate && inputDate <= maxDate;
};

const showParallelRate = computed(() => currencyFrom.value === 'VES' || currencyTo.value === 'VES');

const averageRate = computed(() => {
  if (result.value && parallelResult.value) {
    return (result.value + parallelResult.value) / 2;
  }
  return null;
});

const getCurrencyProperty = (currencyCode, property) => {
  const currency = currencyStore.getCurrencies.find(currency => currency.code === currencyCode);
  return currency ? currency[property] : currencyCode;
};

const nameCurrencyFrom = computed(() => getCurrencyProperty(currencyFrom.value, 'name'));
const nameCurrencyTo = computed(() => getCurrencyProperty(currencyTo.value, 'name'));

const updateResults = () => {
  const rate = exchangeRateStore.getExchangeRate;
  const parallelRate = exchangeRateStore.getParallelRate;

  result.value = amount.value && rate ? parseFloat((amount.value * rate)) : 0;
  parallelResult.value = amount.value && parallelRate ? parseFloat((amount.value * parallelRate)) : 0;
};

const refreshResults = async () => {
  result.value = 0;
  parallelResult.value = 0;
  generalStore.loading = true;
  try {
    if (currencyFrom.value && currencyTo.value && currencyFrom.value !== currencyTo.value && date.value) {
      const promises = [
        exchangeRateStore.fetchExchangeRate({ source: currencyFrom.value, target: currencyTo.value, date: date.value }),
      ];

      if (showParallelRate.value) {
        promises.push(exchangeRateStore.fetchParallelRate({ source: currencyFrom.value, target: currencyTo.value, date: date.value }));
      }
      await Promise.all(promises);
      updateResults();
    }
  } catch (error) {
    generalStore.error = 'No se pudieron obtener los datos. Por favor, inténtalo más tarde.';
  } finally {
    generalStore.loading = false;
  }
};

const exchangeCurrencies = async () => {
  const CURRENCY_FROM = currencyFrom.value;
  currencyFrom.value = currencyTo.value;
  currencyTo.value = CURRENCY_FROM;
}

const resetData = async () => {
  loadSettings();
  date.value = getTodayForCalendar();
  amount.value = 1;
}

const initializeData = async () => {
  if (generalStore.getInitialLoad) {
    loadSettings();
    generalStore.updateCurrentCurrencies(currencyFrom.value, currencyTo.value);
    generalStore.setInitialLoad(false);
  }
  await currencyStore.fetchCurrencies();
  await refreshResults();
};

onMounted(async () => {
  if (!isInitialized.value && parseInt(exchangeRateStore.getExchangeRate, 0) !== 0) {
    await initializeData();
    isInitialized.value = true;
  } else if (parseInt(exchangeRateStore.getExchangeRate, 0) === 0) {
    await resetData();
  }
});

onActivated(async () => {
  if (!isInitialized.value) {
    await initializeData();
    isInitialized.value = true;
  }
});

const debouncedUpdateResults = debounce(updateResults, 200);

watch([currencyFrom, currencyTo, date], refreshResults);
watch([amount, () => exchangeRateStore.getExchangeRate, () => exchangeRateStore.getParallelRate], debouncedUpdateResults);
watch(
  () => generalStore.error,
  (newError) => {
    if (newError && typeof newError === 'string') {
      $q.notify({
        type: 'negative',
        message: newError,
        position: 'center',
        timeout: 3500,
        actions: [{ icon: 'close', color: 'black' }],
        classes: 'custom-notify-error'
      });

      setTimeout(() => generalStore.error = '',3500);
    }
  }
);
</script>

<style scoped>
.container {
  margin: 0 -30px;
}
.result-label {
  font-size: 1rem;
  margin: 8px 5px 5px;
}
.show-result {
  margin: -10px 10px;
}
.text-subtitle2 {
  margin-top: -12px;
}
.my-card .result {
  font-size: 20px;
  font-weight: bold;
  font-family: DialogInput, serif;
  background: #83ffa2;
  padding: 5px 0;
  margin-top: 5px;
}

.btn-reset {
  background-color: #e0f7fa;
  color: #00796b;
  font-weight: bold;
}

.btn-exchange {
  background-color: #ffe0b2;
  color: #ef6c00;
  font-weight: bold;
}

.btn-refresh {
  background-color: #c8e6c9;
  color: #2e7d32;
  font-weight: bold;
}

.q-btn span {
  font-size: 0.9rem; /* Tamaño del texto */
}
</style>
