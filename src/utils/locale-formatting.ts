export function formatAsCurrency(amount: number): string {
  const rounded = Math.floor(amount);
  return rounded.toLocaleString(undefined, {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}
