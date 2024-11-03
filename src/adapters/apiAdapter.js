// src/adapters/apiAdapter.js
import { api } from 'boot/axios'

const API_BASE_URL = process.env.BASE_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const TOKEN_STORAGE_KEY = 'access_token';
const CURRENCIES_STORAGE_KEY = 'currencies_data';

async function getToken() {
  let tokenData = JSON.parse(localStorage.getItem(TOKEN_STORAGE_KEY));

  if (tokenData && new Date().getTime() < tokenData.expires_at) {
    return tokenData.access_token;
  }

  const response = await api.post(`${API_BASE_URL}/oauth/token`, {
    grant_type: 'client_credentials',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    scope: '*'
  });

  tokenData = {
    access_token: response.data.access_token,
    expires_at: new Date().getTime() + response.data.expires_in * 1000,
  };

  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokenData));
  return tokenData.access_token;
}

async function fetchCurrencies() {
  const token = await getToken();
  const cachedData = JSON.parse(localStorage.getItem(CURRENCIES_STORAGE_KEY));
  const oneMonth = 30 * 24 * 60 * 60 * 1000;

  if (cachedData && new Date().getTime() - cachedData.timestamp < oneMonth) {
    return cachedData.data;
  }

  const response = await api.get(`${API_BASE_URL}/api/currency-exchange/currencies?type=all`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const currenciesData = {
    data: response.data.data.data,
    timestamp: new Date().getTime()
  };
  localStorage.setItem(CURRENCIES_STORAGE_KEY, JSON.stringify(currenciesData));
  return currenciesData.data;
}

async function fetchExchangeRate(source, target, date) {
  const token = await getToken();
  const cacheKey = `exchange_rate_${source}_${target}_${date}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));

  const isToday = date === new Date().toISOString().split('T')[0];
  const oneHour = 60 * 60 * 1000;

  if (cachedData && (!isToday || new Date().getTime() - cachedData.timestamp < oneHour)) {
    return cachedData.data;
  }

  const response = await api.get(`${API_BASE_URL}/api/currency-exchange/exchange-rate`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { source_currency: source, target_currency: target, date }
  });

  const exchangeRateData = { data: response.data, timestamp: new Date().getTime() };
  localStorage.setItem(cacheKey, JSON.stringify(exchangeRateData));
  return exchangeRateData.data;
}

async function fetchParallelRate(source, target, date) {
  const token = await getToken();
  const cacheKey = `parallel_rate_${source}_${target}_${date}`;
  const cachedData = JSON.parse(localStorage.getItem(cacheKey));

  const isToday = date === new Date().toISOString().split('T')[0];
  const oneHour = 60 * 60 * 1000;

  if (cachedData && (!isToday || new Date().getTime() - cachedData.timestamp < oneHour)) {
    return cachedData.data;
  }

  const response = await api.get(`${API_BASE_URL}/api/currency-exchange/exchange-parallel-rate`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { source_currency: source, target_currency: target, date }
  });

  const parallelRateData = { data: response.data, timestamp: new Date().getTime() };
  localStorage.setItem(cacheKey, JSON.stringify(parallelRateData));
  return parallelRateData.data;
}

export default {
  fetchCurrencies,
  fetchExchangeRate,
  fetchParallelRate
};
