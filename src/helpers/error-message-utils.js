import { date } from 'quasar';

const formatApiErrorMessage = (defaultDataDate) => {
  const normalizedDate = defaultDataDate.replace(/-/g, '/');
  const today = new Date();
  const normalizedToday = date.formatDate(today, 'YYYY/MM/DD');

  if (normalizedDate === normalizedToday) {
    return 'Error al obtener los datos: se cargaron datos obtenidos hoy, en consultas anteriores.';
  } else {
    const formattedDate = date.formatDate(normalizedDate, 'DD-MM-YYYY');
    return `Error al obtener los datos: se cargaron datos obtenidos el ${formattedDate}.`;
  }
};

export { formatApiErrorMessage };
