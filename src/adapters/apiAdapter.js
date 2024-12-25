import {api} from 'boot/axios';
import {useGeneralStore} from '@/stores/general-store';
import {formatApiErrorMessage} from '@/helpers/error-message-utils';
import {isToday, normalizeDate} from '@/helpers/date-utils';

const API_BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'access_token';
const CURRENCIES_STORAGE_KEY = 'currencies_data';

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * ONE_HOUR_MS;

/**
 * Helper function for fetching cached data
 */
async function fetchCachedData(cacheKey, fetchFunction, isValid) {
  const generalStore = useGeneralStore();

  try {
    generalStore.loading = true;

    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && isValid(cachedData)) {
      return cachedData.data;
    }

    const fetchedData = await fetchFunction();
    localStorage.setItem(cacheKey, JSON.stringify({ data: fetchedData, timestamp: new Date().getTime() }));

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching cached data for key ${cacheKey}:`, error);
    return null;
  } finally {
    generalStore.loading = false;
  }
}

async function getToken() {
  const generalStore = useGeneralStore();
  try {
    generalStore.loading = true;

    const cachedToken = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY));
    if (cachedToken && new Date().getTime() < cachedToken.expires_at) {
      return cachedToken.access_token;
    }

    const response = await api.post(`${API_BASE_URL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      scope: '*'
    });

    const tokenData = {
      access_token: response.data.access_token,
      expires_at: new Date().getTime() + response.data.expires_in * 1000
    };

    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
    return tokenData.access_token;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  } finally {
    generalStore.loading = false;
  }
}

async function fetchCurrencies() {
  const generalStore = useGeneralStore();
  try {
    generalStore.loading = true;

    const token = await getToken();
    validateToken(token);

    return fetchCachedData(
      CURRENCIES_STORAGE_KEY,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/currencies?type=all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return response.data.data.data;
      },
      (cachedData) => new Date().getTime() - cachedData.timestamp < ONE_MONTH_MS
    );
  } catch (error) {
    console.error('Error fetching currencies:', error);
    return [];
  } finally {
    generalStore.loading = false;
  }
}

async function fetchRateWithCache(endpoint, cacheKey, source, target, date, callbackKeyName, isTodayCheck, isValidCache) {
  const generalStore = useGeneralStore();
  const CALLBACK_KEY = callbackKeyName;

  try {
    generalStore.loading = true;

    const token = await getToken();
    validateToken(token);

    const response = await fetchCachedData(
      cacheKey,
      async () => {
        return await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          params: { source_currency: source, target_currency: target, date }
        }).then((res) => res.data);
      },
      isValidCache
    );

    if (response && response.success) {
      const defaultFrom = localStorage.getItem('currencyFrom') || 'USD';
      const defaultTo = localStorage.getItem('currencyTo') || 'VES';

      if (
        (source === defaultFrom && target === defaultTo) ||
        (source === defaultTo && target === defaultFrom)
      ) {
        localStorage.setItem(CALLBACK_KEY, JSON.stringify(response));
      }

      return response;
    } else {
      throw new Error('API not available.');
    }
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}`, error);

    const defaultData = JSON.parse(localStorage.getItem(CALLBACK_KEY));
    if (defaultData && defaultData.success) {
      generalStore.error = formatApiErrorMessage(defaultData.data.date);
      if (isTodayCheck && source === defaultData.data.source_currency && target === defaultData.data.target_currency) {
        return defaultData;
      }

      if (isTodayCheck && source === defaultData.data.target_currency && target === defaultData.data.source_currency) {
        return {
          ...defaultData,
          data: {
            ...defaultData.data,
            source_currency: source,
            target_currency: target,
            exchange_rate: (1 / parseFloat(defaultData.data.exchange_rate)).toString(),
          },
        };
      }
    } else {
      generalStore.error = 'No se pudieron obtener los datos. Por favor, inténtalo más tarde.';
    }
  } finally {
    generalStore.loading = false;
  }

  return null;
}

async function fetchExchangeRate(source, target, date) {
  const normalizedDate = normalizeDate(date);
  const todayCheck = isToday(normalizedDate);

  return fetchRateWithCache(
    `${API_BASE_URL}/api/currency-exchange/exchange-rate`,
    `exchange_rate_${source}_${target}_${normalizedDate}`,
    source,
    target,
    normalizedDate,
    'default_exchange_rate',
    todayCheck,
    (cachedData) => {
      const cacheAge = new Date().getTime() - cachedData.timestamp;
      return todayCheck ? cacheAge < FIVE_MINUTES_MS : cacheAge < ONE_MONTH_MS;
    }
  );
}

async function fetchParallelRate(source, target, date) {
  const normalizedDate = normalizeDate(date);
  const todayCheck = isToday(normalizedDate);

  return fetchRateWithCache(
    `${API_BASE_URL}/api/currency-exchange/exchange-parallel-rate`,
    `parallel_rate_${source}_${target}_${normalizedDate}`,
    source,
    target,
    normalizedDate,
    'default_parallel_rate',
    todayCheck,
    (cachedData) => {
      const cacheAge = new Date().getTime() - cachedData.timestamp;
      return todayCheck ? cacheAge < FIVE_MINUTES_MS : cacheAge < ONE_MONTH_MS;
    }
  );
}

/**
 * Utility function to validate token availability.
 */
function validateToken(token) {
  if (!token) {
    throw new Error('No token available');
  }
}

export default {
  fetchCurrencies,
  fetchExchangeRate,
  fetchParallelRate
};
