import { api } from 'boot/axios';
import { useGeneralStore } from '@/stores/general-store';
const API_BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'access_token';
const CURRENCIES_STORAGE_KEY = 'currencies_data';

const FIVE_MINUTES_MS = 5 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * ONE_HOUR_MS;

/**
 * Normalize a date string to use "/" as the separator.
 * @param {string} date - The date string in any format (e.g. "2024-12-20" or "2024/12/20").
 * @returns {string} - The normalized date string (e.g. "2024/12/20").
 */
function normalizeDate(date) {
  return date.replaceAll('-', '/');
}

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
    if (!token) {
      throw new Error('No token available');
    }

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

async function fetchExchangeRate(source, target, date) {
  const generalStore = useGeneralStore();
  try {
    generalStore.loading = true;

    const token = await getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const normalizedDate = normalizeDate(date);
    const cacheKey = `exchange_rate_${source}_${target}_${normalizedDate}`;
    const isToday = normalizedDate === new Date().toISOString().split('T')[0].replaceAll('-', '/');

    return fetchCachedData(
      cacheKey,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/exchange-rate`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { source_currency: source, target_currency: target, date: normalizedDate }
          }
        );
        return response.data;
      },
      (cachedData) => {
        const cacheAge = new Date().getTime() - cachedData.timestamp;
        return isToday
          ? cacheAge < FIVE_MINUTES_MS
          : cacheAge < ONE_MONTH_MS;
      }
    );
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null;
  } finally {
    generalStore.loading = false;
  }
}

async function fetchParallelRate(source, target, date) {
  const generalStore = useGeneralStore();
  try {
    generalStore.loading = true;

    const token = await getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const normalizedDate = normalizeDate(date);
    const cacheKey = `parallel_rate_${source}_${target}_${normalizedDate}`;
    const isToday = normalizedDate === new Date().toISOString().split('T')[0].replaceAll('-', '/');

    return fetchCachedData(
      cacheKey,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/exchange-parallel-rate`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { source_currency: source, target_currency: target, date: normalizedDate }
          }
        );
        return response.data;
      },
      (cachedData) => {
        const cacheAge = new Date().getTime() - cachedData.timestamp;
        return isToday
          ? cacheAge < FIVE_MINUTES_MS
          : cacheAge < ONE_MONTH_MS;
      }
    );
  } catch (error) {
    console.error('Error fetching parallel rate:', error);
    return null;
  } finally {
    generalStore.loading = false;
  }
}

export default {
  fetchCurrencies,
  fetchExchangeRate,
  fetchParallelRate
};
