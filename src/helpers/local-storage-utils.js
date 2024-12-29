const isValidDateFormat = (dateString) => {
  const datePattern = /^\d{4}\/\d{2}\/\d{2}$/;
  return datePattern.test(dateString);
};

const clearMidnightExpiringItems = () => {
  const now = new Date();
  const today = now.toISOString().slice(0, 10).replace(/-/g, '/');
  const keys = Object.keys(localStorage);
  let deletedCount = 0;

  keys.forEach((key) => {
    const keyDate = key.slice(-10);

    if (!isValidDateFormat(keyDate)) {
      return;
    }

    if (keyDate === today) {
      localStorage.removeItem(key);
      deletedCount++;
    } else {
      const data = JSON.parse(localStorage.getItem(key));
      if (data?.expiresAt) {
        const expiresAtDate = new Date(data.expiresAt);
        const midnight = new Date();
        midnight.setHours(23, 59, 59, 999);
        if (expiresAtDate.getTime() === midnight.getTime()) {
          localStorage.removeItem(key);
          deletedCount++;
        }
      }
    }
  });

  return deletedCount;
};

const clearExpiredItems = () => {
  const now = Date.now();
  const keys = Object.keys(localStorage);
  let deletedCount = 0;

  keys.forEach((key) => {
    const data = JSON.parse(localStorage.getItem(key));
    if (data?.expiresAt && data.expiresAt < now) {
      localStorage.removeItem(key);
      deletedCount++;
    }
  });

  return deletedCount;
}

const clearExchangeAndParallelCurrent = () => {
  const from = localStorage.getItem('currencyFrom') || 'USD';
  const to = localStorage.getItem('currencyTo') || 'VES';

  const today = new Date().toLocaleDateString("en-CA").replaceAll("-","/");

  const keysToDelete = [
    `exchange_rate_${from}_${to}_${today}`,
    `exchange_rate_${to}_${from}_${today}`,
    `parallel_rate_${from}_${to}_${today}`,
    `parallel_rate_${to}_${from}_${today}`,
  ];

  keysToDelete.forEach((key) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
  });
};

export {
  clearMidnightExpiringItems,
  clearExpiredItems,
  clearExchangeAndParallelCurrent
};
