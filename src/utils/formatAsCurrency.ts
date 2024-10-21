export function formatAsCurrency(amount: number): string {
  const rounded = Math.round(amount);
  return rounded.toLocaleString("de-DE", {
    style: "currency",
    currency: "EUR",
    currencyDisplay: "symbol",
    maximumFractionDigits: 0,
  });
}
