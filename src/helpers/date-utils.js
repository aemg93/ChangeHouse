import { date } from 'quasar'

const getToday = () => {
  const timeStamp = Date.now()
  return date.formatDate(timeStamp, 'YYYY-MM-DD')
}

const getTodayForCalendar = () => {
  const timeStamp = Date.now()
  return date.formatDate(timeStamp, 'YYYY/MM/DD')
}

export {
  getToday,
  getTodayForCalendar
};
