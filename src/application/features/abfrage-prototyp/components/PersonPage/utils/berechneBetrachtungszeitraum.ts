import { Ausklammerung } from "@/application/features/abfrage-prototyp/components/berechneBemessungszeitraum";

export type Zeitraum = { von: Date; bis: Date };

export function berechneBetrachtungszeitraum(
  geburtsdatum: Date,
  ausklammerungen: Ausklammerung[],
): Zeitraum {
  const startJahr = findeJahrOhneAusklammerung(
    vorherigesJahr(geburtsdatum),
    ausklammerungen,
  );

  return {
    von: new Date(Date.UTC(startJahr.getUTCFullYear(), 0, 1)),
    bis: geburtsdatum,
  };
}

function findeJahrOhneAusklammerung(
  jahr: Date,
  ausklammerungen: readonly Ausklammerung[],
  suchlimitJahr: number = 2000,
): Date {
  if (jahr.getUTCFullYear() < suchlimitJahr) {
    return new Date(Date.UTC(suchlimitJahr));
  }

  const hasAusklammerung = istAusklammerungInJahr(
    jahr.getUTCFullYear(),
    ausklammerungen,
  );

  if (hasAusklammerung) {
    const vorherigesJahr = new Date(Date.UTC(jahr.getUTCFullYear() - 1, 0, 1));

    return findeJahrOhneAusklammerung(vorherigesJahr, ausklammerungen);
  }

  return jahr;
}

function istAusklammerungInJahr(
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

function vorherigesJahr(datum: Date): Date {
  const naechstesDatum = new Date(datum);
  naechstesDatum.setUTCFullYear(naechstesDatum.getUTCFullYear() - 1);
  return naechstesDatum;
}
