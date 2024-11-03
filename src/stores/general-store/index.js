import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGeneralStore = defineStore('general', () => {
  const loading = ref(false);
  const error = ref('');

  const setLoading = (value) => {
    loading.value = value;
  };

  const setError = (message) => {
    error.value = message;
  };

  return { loading, error, setLoading, setError };
});
