const currencyFormat = (amount, currency) => {
  let format = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: amount < 1 ? 6 : 2,
    maximumFractionDigits: amount < 1 ? 6 : 2,
  });

  return format.format(amount);
}

export { currencyFormat };
