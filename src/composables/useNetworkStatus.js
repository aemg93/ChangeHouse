import { ref, onMounted, onUnmounted } from 'vue';

export const useNetworkStatus = () => {
  const isOnline = ref(navigator.onLine);

  const updateConnectionStatus = () => {
    isOnline.value = navigator.onLine;
    console.log('Estado de la red desde el composable:', isOnline.value ? 'Online' : 'Offline');
  };

  onMounted(() => {
    window.addEventListener('online', updateConnectionStatus);
    window.addEventListener('offline', updateConnectionStatus);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateConnectionStatus);
    window.removeEventListener('offline', updateConnectionStatus);
  });

  return { isOnline }; // Retorna isOnline como ref
};
