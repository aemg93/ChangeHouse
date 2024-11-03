const currencyFormat = (amount, currency) => {
  let format = new Intl.NumberFormat('es-VE', {
    style: 'currency',
    currency: currency,
  });
  return format.format(amount);
}

export { currencyFormat };
