<template>
  <q-page class="flex flex-center">
    <div style="max-width: 400px; width: 100%; padding: 20px;">
      <h6 class="text-center">Configuración</h6>

      <p class="description q-mt-md">Configura tus monedas iniciales para la conversión.</p>

      <q-select
        v-model="currencyFrom"
        :options="filteredOptionsFrom"
        filled
        label="Moneda de origen"
        emit-value
        map-options
        use-input
        @filter="filterFrom"
        class="q-mt-md"
        :rules="[validateCurrencies]"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section>No hay resultados disponibles</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-select
        v-model="currencyTo"
        :options="filteredOptionsTo"
        filled
        label="Moneda de destino"
        emit-value
        map-options
        use-input
        @filter="filterTo"
        class="q-mt-md"
        :rules="[validateCurrencies]"
      >
        <template v-slot:no-option>
          <q-item>
            <q-item-section>No hay resultados disponibles</q-item-section>
          </q-item>
        </template>
      </q-select>

      <q-btn
        label="Guardar configuración"
        color="primary"
        unelevated
        class="q-mt-lg full-width"
        :disable="!isValid"
        @click="saveSettings"
      />

      <p v-if="successMessage" class="text-positive q-mt-md text-center">{{ successMessage }}</p>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useCurrencyStore } from '@/stores/currency-store';

const currencyStore = useCurrencyStore();

const currencyFrom = ref('');
const currencyTo = ref('');
const successMessage = ref('');

const validateCurrencies = () => {
  if (!currencyFrom.value || !currencyTo.value) {
    return "Debe seleccionar ambas monedas.";
  }
  if (currencyFrom.value === currencyTo.value) {
    return "Las monedas deben ser diferentes.";
  }
  return true;
};

const loadSettings = () => {
  const from = localStorage.getItem('currencyFrom') || 'USD';
  const to = localStorage.getItem('currencyTo') || 'VES';
  currencyFrom.value = from;
  currencyTo.value = to;
};

const saveSettings = () => {
  localStorage.setItem('currencyFrom', currencyFrom.value);
  localStorage.setItem('currencyTo', currencyTo.value);
  successMessage.value = 'Configuración guardada exitosamente.';
  setTimeout(() => {
    successMessage.value = '';
  }, 3000);
};

const options = computed(() =>
  currencyStore.getCurrencies.map(currency => ({
    label: currency.name,
    value: currency.code
  }))
);

const searchFrom = ref('');
const searchTo = ref('');

const filteredOptionsFrom = computed(() => {
  return options.value.filter(option => {
    const label = option.label.toLowerCase();
    const search = searchFrom.value.toLowerCase();
    return option.value !== currencyTo.value && label.includes(search);
  });
});

const filteredOptionsTo = computed(() => {
  return options.value.filter(option => {
    const label = option.label.toLowerCase();
    const search = searchTo.value.toLowerCase();
    return option.value !== currencyFrom.value && label.includes(search);
  });
});

const filterFrom = (val, update) => {
  searchFrom.value = val;
  update(() => {
    return options.value.filter(option => {
      const label = option.label.toLowerCase();
      const search = searchFrom.value.toLowerCase();
      return option.value !== currencyTo.value && label.includes(search);
    });
  });
};
const filterTo = (val, update) => {
  searchTo.value = val;
  update(() => {
    return options.value.filter(option => {
      const label = option.label.toLowerCase();
      const search = searchTo.value.toLowerCase();
      return option.value !== currencyFrom.value && label.includes(search);
    });
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
