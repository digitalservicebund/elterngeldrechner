export interface Zeitraum {
  from: Date;
  to: Date;
}

export function formatZeitraum(zeitraum: Zeitraum): string {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = zeitraum.from.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = zeitraum.to.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formattedFrom} bis ${formattedTo}`;
}
