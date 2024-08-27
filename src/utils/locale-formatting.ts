export function formatAsCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}

export function parseGermanDateString(dateString: string): Date {
  const [day, month, year] = dateString.split(".");
  return new Date(
    Number.parseInt(year),
    Number.parseInt(month) - 1,
    Number.parseInt(day),
  );
}
