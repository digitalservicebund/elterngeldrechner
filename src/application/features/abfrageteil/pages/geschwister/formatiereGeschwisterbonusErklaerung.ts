import { Temporal } from "@js-temporal/polyfill";
import { GeschwisterkindAngaben } from "./GeschwisterSchema";

/**
 * `ausschlaggebendeGeschwisterkinder` kann mehrere Geschwisterkinder mit
 * unterschiedlichem Alter enthalten, wenn sie am selben Tag unterschiedliche
 * Altersgrenzen erreichen (z. B. bei gleichem Geburtstag und genau drei
 * Jahren Abstand: eines wird drei, das andere sechs). Dieser Fall ist so
 * selten, dass hier bewusst nur die jüngste Altersgruppe genannt und die
 * restlichen Geschwisterkinder aus der Erklärung weggelassen werden, statt
 * eine zusammengesetzte Formulierung für mehrere Altersgruppen zu bauen.
 */
export function formatiereGeschwisterbonusErklaerung(
  ausschlaggebendeGeschwisterkinder: readonly GeschwisterkindAngaben[],
  enddatum: Date,
): string {
  const monatUndJahr = enddatum.toLocaleString("de-DE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const enddatumAlsPlainDate = Temporal.PlainDate.from(
    enddatum.toISOString().slice(0, 10),
  );

  // Aufsteigend nach Alter sortiert, damit unten die jüngste Altersgruppe
  // (der erste Eintrag) ausgewählt werden kann.
  const geschwisterkinderMitAlter = ausschlaggebendeGeschwisterkinder
    .map((geschwisterkind) => ({
      geschwisterkind,
      alter: enddatumAlsPlainDate.year - geschwisterkind.geburtsdatum.year,
    }))
    .sort((a, b) => a.alter - b.alter);

  if (
    geschwisterkinderMitAlter.length === 0 ||
    geschwisterkinderMitAlter[0] === undefined
  ) {
    return `Sie können den Geschwisterbonus bis zum ${monatUndJahr} erhalten.`;
  }

  const ausschlaggebendesAlter = geschwisterkinderMitAlter[0].alter;
  const relevanteGeschwisterkinder = geschwisterkinderMitAlter.filter(
    (geschwisterkind) => geschwisterkind.alter === ausschlaggebendesAlter,
  );
  const namen = namesFormatter.format(
    relevanteGeschwisterkinder.map((kind) => kind.geschwisterkind.name),
  );

  return `Sie können den Geschwisterbonus so lange erhalten, bis ${namen} im ${monatUndJahr} ${formatiereAlterAlsWort(ausschlaggebendesAlter)} Jahre alt ${relevanteGeschwisterkinder.length === 1 ? "wird" : "werden"}.`;
}

const namesFormatter = new Intl.ListFormat("de", {
  style: "long",
  type: "conjunction",
});

function formatiereAlterAlsWort(alter: number): string {
  if (alter === 3) return "drei";
  if (alter === 6) return "sechs";
  return alter.toString();
}

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;

  const enddatum = new Date("2028-07-17");
  const geschwisterkindUnter3 = {
    name: "Luise",
    geburtsdatum: new Temporal.PlainDate(2025, 7, 17),
    hatBehinderung: false,
  };
  const geschwisterkindUnter14MitBehinderung = {
    name: "Ben",
    geburtsdatum: new Temporal.PlainDate(2014, 7, 17),
    hatBehinderung: true,
  };
  const zwillingEins = {
    name: "Emma",
    geburtsdatum: new Temporal.PlainDate(2022, 7, 17),
    hatBehinderung: false,
  };
  const zwillingZwei = {
    name: "Ida",
    geburtsdatum: new Temporal.PlainDate(2022, 7, 17),
    hatBehinderung: false,
  };

  describe("formatiereGeschwisterbonusErklaerung", () => {
    test.for([
      {
        ausschlaggebendeGeschwisterkinder: [geschwisterkindUnter3],
        expected:
          "Sie können den Geschwisterbonus so lange erhalten, bis Luise im Juli 2028 drei Jahre alt wird.",
      },
      {
        ausschlaggebendeGeschwisterkinder: [
          geschwisterkindUnter14MitBehinderung,
        ],
        expected:
          "Sie können den Geschwisterbonus so lange erhalten, bis Ben im Juli 2028 14 Jahre alt wird.",
      },
      {
        ausschlaggebendeGeschwisterkinder: [zwillingEins, zwillingZwei],
        expected:
          "Sie können den Geschwisterbonus so lange erhalten, bis Emma und Ida im Juli 2028 sechs Jahre alt werden.",
      },
      {
        // Luise (geboren 2025-07-17) wird drei, Emma (geboren 2022-07-17)
        // wird am selben Tag sechs. Beide sind laut
        // berechneEnddatumDesGeschwisterbonus ausschlaggebend; die Erklärung
        // nennt bewusst nur die jüngste Altersgruppe statt eine zusammengesetzte
        // Formulierung für mehrere unterschiedliche Altersgruppen zu bauen.
        ausschlaggebendeGeschwisterkinder: [
          geschwisterkindUnter3,
          zwillingEins,
        ],
        expected:
          "Sie können den Geschwisterbonus so lange erhalten, bis Luise im Juli 2028 drei Jahre alt wird.",
      },
      {
        ausschlaggebendeGeschwisterkinder: [],
        expected: "Sie können den Geschwisterbonus bis zum Juli 2028 erhalten.",
      },
    ])("$expected", ({ ausschlaggebendeGeschwisterkinder, expected }) => {
      const result = formatiereGeschwisterbonusErklaerung(
        ausschlaggebendeGeschwisterkinder,
        enddatum,
      );

      expect(result).toBe(expected);
    });
  });
}
