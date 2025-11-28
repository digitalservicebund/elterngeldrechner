export function naechsterMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum.getTime());
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() + 1);
  return naechstesDatum;
}

export function vorherigerMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum.getTime());
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() - 1);
  return naechstesDatum;
}
