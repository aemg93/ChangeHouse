import {api} from 'boot/axios';
import {useGeneralStore} from '@/stores/general-store';
import {formatApiErrorMessage} from '@/helpers/error-message-utils';
import {isToday, normalizeDate, calculateExpiration, isCacheExpired} from '@/helpers/date-utils';

const API_BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'access_token';
const CURRENCIES_STORAGE_KEY = 'currencies_data';

/**
 * Helper function for fetching cached data
 */
async function fetchCachedData(date, cacheKey, fetchFunction) {
  const generalStore = useGeneralStore();

  try {
    generalStore.loading = true;

    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && !isCacheExpired(cachedData.expiresAt)) {
      return cachedData;
    }

    const fetchedData = await fetchFunction();
    const expiresAt = calculateExpiration(date);
    const dataToCache = { ...fetchedData, expiresAt };

    localStorage.setItem(cacheKey, JSON.stringify(dataToCache));

    return dataToCache;
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

    const date = '2020/01/01';

    return fetchCachedData(
      date,
      CURRENCIES_STORAGE_KEY,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/currencies?type=all`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        return response.data.data;
      },
      (cachedData) => !isCacheExpired(cachedData.expiresAt)
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
      date,
      cacheKey,
      async () => {
        const apiResponse = await api.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
          params: { source_currency: source, target_currency: target, date }
        });

        return apiResponse.data;
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
      return !isCacheExpired(cachedData.expiresAt);
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
      return !isCacheExpired(cachedData.expiresAt);
    }
  );
}

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
