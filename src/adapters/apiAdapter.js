import { api } from 'boot/axios';
import { useGeneralStore } from 'src/store/general-store'; // Importa el store
const API_BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'access_token';
const CURRENCIES_STORAGE_KEY = 'currencies_data';

const ONE_HOUR_MS = 60 * 60 * 1000;
const ONE_MONTH_MS = 30 * 24 * ONE_HOUR_MS;

/**
 * Helper function for fetching cached data
 */
async function fetchCachedData(cacheKey, fetchFunction, isValid) {
  const generalStore = useGeneralStore(); // Instancia el store

  try {
    generalStore.loading = true; // Loading comienza

    const cachedData = JSON.parse(localStorage.getItem(cacheKey));

    if (cachedData && isValid(cachedData)) {
      return cachedData.data;
    }

    const fetchedData = await fetchFunction();
    localStorage.setItem(cacheKey, JSON.stringify({ data: fetchedData, timestamp: new Date().getTime() }));

    return fetchedData;
  } catch (error) {
    console.error(`Error fetching cached data for key ${cacheKey}:`, error);
    return null; // Devuelve un valor predeterminado en caso de error
  } finally {
    generalStore.loading = false; // Loading termina
  }
}

async function getToken() {
  const generalStore = useGeneralStore(); // Instancia el store
  try {
    generalStore.loading = true; // Loading comienza

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
    return null; // Devuelve null si ocurre un error
  } finally {
    generalStore.loading = false; // Loading termina
  }
}

async function fetchCurrencies() {
  const generalStore = useGeneralStore(); // Instancia el store
  try {
    generalStore.loading = true; // Loading comienza

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
    return []; // Devuelve un array vacío en caso de error
  } finally {
    generalStore.loading = false; // Loading termina
  }
}

async function fetchExchangeRate(source, target, date) {
  const generalStore = useGeneralStore(); // Instancia el store
  try {
    generalStore.loading = true; // Loading comienza

    const token = await getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const cacheKey = `exchange_rate_${source}_${target}_${date}`;
    const isToday = date === new Date().toISOString().split('T')[0];

    return fetchCachedData(
      cacheKey,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/exchange-rate`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { source_currency: source, target_currency: target, date }
          }
        );
        return response.data;
      },
      (cachedData) => !isToday || new Date().getTime() - cachedData.timestamp < ONE_HOUR_MS
    );
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return null; // Devuelve null en caso de error
  } finally {
    generalStore.loading = false; // Loading termina
  }
}

async function fetchParallelRate(source, target, date) {
  const generalStore = useGeneralStore(); // Instancia el store
  try {
    generalStore.loading = true; // Loading comienza

    const token = await getToken();
    if (!token) {
      throw new Error('No token available');
    }
    const cacheKey = `parallel_rate_${source}_${target}_${date}`;
    const isToday = date === new Date().toISOString().split('T')[0];

    return fetchCachedData(
      cacheKey,
      async () => {
        const response = await api.get(
          `${API_BASE_URL}/api/currency-exchange/exchange-parallel-rate`,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: { source_currency: source, target_currency: target, date }
          }
        );
        return response.data;
      },
      (cachedData) => !isToday || new Date().getTime() - cachedData.timestamp < ONE_HOUR_MS
    );
  } catch (error) {
    console.error('Error fetching parallel rate:', error);
    return null; // Devuelve null en caso de error
  } finally {
    generalStore.loading = false; // Loading termina
  }
}

export default {
  fetchCurrencies,
  fetchExchangeRate,
  fetchParallelRate
};
