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

export {
  getToday,
  getTodayForCalendar,
  getMinDateForCalendar
};
