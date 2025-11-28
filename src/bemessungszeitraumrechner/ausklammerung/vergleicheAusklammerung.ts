import { Ausklammerung } from "./Ausklammerung";

export function istAusklammerungInJahr(
  jahr: number,
  ausklammerungen: readonly Ausklammerung[],
): boolean {
  return ausklammerungen.some((ausklammerung) => {
    return (
      ausklammerung.von < new Date(Date.UTC(jahr + 1, 0, 1)) &&
      ausklammerung.bis >= new Date(Date.UTC(jahr, 0, 1))
    );
  });
}

export function istAusklammerungInMonat(
  monat: Date,
  ausklammerungen: readonly Ausklammerung[],
): boolean {
  return ausklammerungen.some((ausklammerung) => {
    return (
      ausklammerung.von < naechsterMonat(monat) && ausklammerung.bis >= monat
    );
  });
}

function naechsterMonat(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCMonth(naechstesDatum.getUTCMonth() + 1);
  return naechstesDatum;
}
