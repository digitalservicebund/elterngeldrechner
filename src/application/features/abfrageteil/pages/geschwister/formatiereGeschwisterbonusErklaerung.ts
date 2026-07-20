import { Temporal } from "@js-temporal/polyfill";
import { GeschwisterkindAngaben } from "./GeschwisterSchema";

export function formatiereGeschwisterbonusErklaerung(
  geschwisterkinder: readonly GeschwisterkindAngaben[],
  enddatum: Date,
): string {
  const monatUndJahr = enddatum.toLocaleString("de-DE", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  const ausschlaggebendesGeschwisterkind =
    bestimmeAusschlaggebendesGeschwisterkind(geschwisterkinder, enddatum);

  if (ausschlaggebendesGeschwisterkind) {
    const konjugiertesVerb = ausschlaggebendesGeschwisterkind.mehrzahl
      ? "werden"
      : "wird";
    return `Sie erhalten den Bonus so lange, bis ${ausschlaggebendesGeschwisterkind.namen} im ${monatUndJahr} ${ausschlaggebendesGeschwisterkind.relevantesAlter} Jahre alt ${konjugiertesVerb}.`;
  }

  return `Sie erhalten den Bonus bis zum ${monatUndJahr}.`;
}

const namesFormatter = new Intl.ListFormat("de", {
  style: "long",
  type: "conjunction",
});

function bestimmeAusschlaggebendesGeschwisterkind(
  geschwisterkinder: readonly GeschwisterkindAngaben[],
  enddatum: Date,
): { namen: string; relevantesAlter: string; mehrzahl: boolean } | undefined {
  const enddatumAlsPlainDate = Temporal.PlainDate.from(
    enddatum.toISOString().slice(0, 10),
  );

  const relevanteGeschwisterkinder = geschwisterkinder
    .map((geschwisterkind) => ({
      geschwisterkind,
      alter: enddatumAlsPlainDate.year - geschwisterkind.geburtsdatum.year,
    }))
    .filter(
      ({ geschwisterkind, alter }) =>
        geschwisterkind.geburtsdatum.day === enddatumAlsPlainDate.day &&
        geschwisterkind.geburtsdatum.month === enddatumAlsPlainDate.month &&
        (alter === 3 ||
          alter === 6 ||
          (alter === 14 && geschwisterkind.hatBehinderung)),
    );

  if (relevanteGeschwisterkinder.length === 0) {
    return undefined;
  }

  const hoechstesAlter = Math.max(
    ...relevanteGeschwisterkinder.map(({ alter }) => alter),
  );
  const ausschlaggebendeGeschwisterkinder = relevanteGeschwisterkinder.filter(
    ({ alter }) => alter === hoechstesAlter,
  );

  return {
    namen: namesFormatter.format(
      ausschlaggebendeGeschwisterkinder.map(
        ({ geschwisterkind }) => geschwisterkind.name,
      ),
    ),
    relevantesAlter: formatiereAlterAlsWort(hoechstesAlter),
    mehrzahl: ausschlaggebendeGeschwisterkinder.length > 1,
  };
}

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
  const geschwisterkindZwischen3Und6 = {
    name: "Paul",
    geburtsdatum: new Temporal.PlainDate(2024, 5, 1),
    hatBehinderung: false,
  };
  const geschwisterkindUnter6 = {
    name: "Johann",
    geburtsdatum: new Temporal.PlainDate(2022, 7, 17),
    hatBehinderung: false,
  };
  const geschwisterkindUeber6 = {
    name: "Mia",
    geburtsdatum: new Temporal.PlainDate(2021, 7, 17),
    hatBehinderung: false,
  };
  const geschwisterkindUnter14MitBehinderung = {
    name: "Ben",
    geburtsdatum: new Temporal.PlainDate(2014, 7, 17),
    hatBehinderung: true,
  };
  const geschwisterkindOhnePassendesAlter = {
    name: "Klara",
    geburtsdatum: new Temporal.PlainDate(2010, 7, 17),
    hatBehinderung: false,
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

  describe("bestimmeAusschlaggebendesGeschwisterkind", () => {
    test.for([
      {
        geschwisterkinder: [geschwisterkindUnter3, geschwisterkindUeber6],
        expected: { namen: "Luise", relevantesAlter: "drei", mehrzahl: false },
      },
      {
        geschwisterkinder: [
          geschwisterkindZwischen3Und6,
          geschwisterkindUnter6,
        ],
        expected: {
          namen: "Johann",
          relevantesAlter: "sechs",
          mehrzahl: false,
        },
      },
      {
        geschwisterkinder: [
          geschwisterkindUeber6,
          geschwisterkindUnter14MitBehinderung,
        ],
        expected: { namen: "Ben", relevantesAlter: "14", mehrzahl: false },
      },
      {
        geschwisterkinder: [
          geschwisterkindUeber6,
          geschwisterkindOhnePassendesAlter,
        ],
        expected: undefined,
      },
      {
        geschwisterkinder: [zwillingEins, zwillingZwei],
        expected: {
          namen: "Emma und Ida",
          relevantesAlter: "sechs",
          mehrzahl: true,
        },
      },
      {
        geschwisterkinder: [geschwisterkindUnter3, geschwisterkindUnter6],
        expected: {
          namen: "Johann",
          relevantesAlter: "sechs",
          mehrzahl: false,
        },
      },
    ])(
      "returns $expected for $geschwisterkinder.0.name and $geschwisterkinder.1.name",
      ({ geschwisterkinder, expected }) => {
        const result = bestimmeAusschlaggebendesGeschwisterkind(
          geschwisterkinder,
          enddatum,
        );

        expect(result).toEqual(expected);
      },
    );
  });

  describe("formatiereGeschwisterbonusErklaerung", () => {
    test.for([
      {
        geschwisterkinder: [geschwisterkindUnter3],
        expected:
          "Sie erhalten den Bonus so lange, bis Luise im Juli 2028 drei Jahre alt wird.",
      },
      {
        geschwisterkinder: [geschwisterkindUnter3, geschwisterkindUeber6],
        expected:
          "Sie erhalten den Bonus so lange, bis Luise im Juli 2028 drei Jahre alt wird.",
      },
      {
        geschwisterkinder: [
          geschwisterkindUeber6,
          geschwisterkindOhnePassendesAlter,
        ],
        expected: "Sie erhalten den Bonus bis zum Juli 2028.",
      },
      {
        geschwisterkinder: [zwillingEins, zwillingZwei],
        expected:
          "Sie erhalten den Bonus so lange, bis Emma und Ida im Juli 2028 sechs Jahre alt werden.",
      },
    ])("$expected", ({ geschwisterkinder, expected }) => {
      const result = formatiereGeschwisterbonusErklaerung(
        geschwisterkinder,
        enddatum,
      );

      expect(result).toBe(expected);
    });
  });
}
