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

export {
  getToday,
  getTodayForCalendar,
  getMinDateForCalendar,
  normalizeDate,
  isToday
};
