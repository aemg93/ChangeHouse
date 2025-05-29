import { date } from 'quasar'

const getToday = () => {
  const timeStamp = Date.now()
  return date.formatDate(timeStamp, 'YYYY-MM-DD')
}

const getTodayForCalendar = () => {
  const timeStamp = Date.now()
  return date.formatDate(timeStamp, 'YYYY/MM/DD')
}

const getMinDateForCalendar = () => {
  const minDateTimeStamp = new Date('2000-01-01').getTime();
  return date.formatDate(minDateTimeStamp, 'YYYY/MM/DD');
};

const normalizeDate = date => {
  return date.replaceAll('-', '/');
}

const isToday = date => {
  const today = new Date().toLocaleDateString('en-CA').replaceAll('-', '/');
  return normalizeDate(date) === today;
}

const calculateExpiration = (dateString) => {
  const normalizedDate = normalizeDate(dateString);
  const now = new Date();
  const targetDate = new Date(normalizedDate);

  if (isToday(normalizedDate)) {
    targetDate.setHours(23, 59, 59, 999);
    return targetDate.getTime();
  }

  now.setDate(now.getDate() + 30);
  now.setHours(23, 59, 59, 999);
  return now.getTime();
};


const isCacheExpired = (expiresAt) => {
  return Date.now() > expiresAt;
};

export {
  getToday,
  getTodayForCalendar,
  getMinDateForCalendar,
  normalizeDate,
  isToday,
  calculateExpiration,
  isCacheExpired
};
