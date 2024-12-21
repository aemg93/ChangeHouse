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
              class="q-mb-md"
              hint="Disponible desde el 01 de enero de 2000"
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
          <div class="col-refresh-btn">
            <q-btn
              flat
              icon="refresh"
              color="primary"
              class="refresh-btn q-ml-sm"
              @click="refreshResults"
            >
              <q-tooltip :hide-delay="700" class="bg-primary text-white">
                Refrescando
              </q-tooltip>
            </q-btn>
          </div>
        </div>

        <AmountInput v-model="amount" />

        <CurrencySelect
          v-model="currencyFrom"
          :options="filteredOptionsFrom"
          label="Moneda de origen"
          :filter-handler="filterFrom"
        />

        <CurrencySelect
          v-model="currencyTo"
          :options="filteredOptionsTo"
          label="Moneda destino"
          :filter-handler="filterTo"
        />
      </div>

      <div class="q-mt-md q-mb-md result-label">
        <div v-if="!generalStore.loading && result !== null">{{ `${currencyFormat(amount, currencyFrom)}` }} equivale a</div>
        <div v-if="generalStore.error" class="error">{{ generalStore.error }}</div>
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
import { useQuasar } from 'quasar';

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
const isInitialized = ref(false);

const currencyStore = useCurrencyStore();
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
  return inputDate > minDate && inputDate < maxDate;
};

const options = computed(() =>
  currencyStore.getCurrencies.map(currency => ({
    label: currency.name,
    value: currency.code,
  }))
);

const removeAccents = (str) => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

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

const filterFrom = (val, update) => {
  searchFrom.value = val;
  update();
};

const filterTo = (val, update) => {
  searchTo.value = val;
  update();
};

const updateResults = () => {
  const rate = exchangeRateStore.getExchangeRate;
  const parallelRate = exchangeRateStore.getParallelRate;

  result.value = amount.value && rate ? parseFloat((amount.value * rate).toFixed(4)) : 0;
  parallelResult.value = amount.value && parallelRate ? parseFloat((amount.value * parallelRate).toFixed(4)) : 0;
};

const refreshResults = async () => {
  generalStore.loading = true;
  try {
    if (currencyFrom.value && currencyTo.value && date.value) {
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

const initializeData = async () => {
  if (generalStore.getInitialLoad) {
    const storedFrom = localStorage.getItem('currencyFrom') || 'USD';
    const storedTo = localStorage.getItem('currencyTo') || 'VES';
    currencyFrom.value = storedFrom;
    currencyTo.value = storedTo;
    generalStore.updateCurrentCurrencies(currencyFrom.value, currencyTo.value);
    generalStore.setInitialLoad(false);
  }
  await currencyStore.fetchCurrencies();
  await refreshResults();
};

onMounted(async () => {
  if (!isInitialized.value) {
    await initializeData();
    isInitialized.value = true;
  }
});

onActivated(async () => {
  if (!isInitialized.value) {
    await initializeData();
    isInitialized.value = true;
  }
});

const debouncedUpdateResults = debounce(updateResults, 300);

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
        timeout: 5000,
      });

      generalStore.error = '';
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
.col-refresh-btn {
  min-width: 60px !important;
  display: flex;
  justify-content: flex-end;
  margin-top: -34px;
}
.refresh-btn {
  height: 56px;
  background-color: #4A90E2;
  color: #FFFFFF !important;
}
</style>

<style>
.q-field__native:has(input[aria-expanded="true"]) span {
  display: none !important;
}
.q-field__control:before,
.q-field__control:after {
  content: unset !important;
}
</style>
