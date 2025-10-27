import type { ReactNode } from "react";
import { AuswahloptionPlakette } from "./AuswahloptionPlakette";
import { Beispiel } from "@/application/features/beispiele";
import {
  Ausgangslage,
  AusgangslageFuerEinElternteil,
  Auswahloption,
  Elternteil,
  KeinElterngeld,
  listeLebensmonateAuf,
} from "@/monatsplaner";

type Props = {
  readonly beispiele: Beispiel<Ausgangslage>[];
};

export function AuswahloptionenLegende({ beispiele }: Props): ReactNode {
  const auswahloptionen = findeVerwendeteAuswahloptionen(beispiele);

  return (
    <div className="rounded border border-solid border-grey p-20 pt-10">
      <p className="pb-10">Erklärung Abbildung:</p>
      <ul className="flex flex-wrap gap-16 md:gap-56" aria-hidden="true">
        {auswahloptionen.map((option) => (
          <li key={option} className="flex items-center gap-10">
            <AuswahloptionPlakette
              auswahloption={option}
              className="h-[24px] w-[64px] text-14 font-bold leading-tight"
            />
            <span>= {option}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function findeVerwendeteAuswahloptionen(
  beispiele: Beispiel<Ausgangslage>[],
): Auswahloption[] {
  return beispiele
    .flatMap((beispiel) => listeLebensmonateAuf(beispiel.plan.lebensmonate))
    .flatMap(([_, lebensmonat]) => Object.values(lebensmonat))
    .flatMap((elternteil) => elternteil?.gewaehlteOption)
    .map((option) => (option === undefined ? KeinElterngeld : option))
    .reduce(
      (acc, item) => (acc.includes(item) ? acc : [...acc, item]),
      [] as Auswahloption[],
    )
    .toSorted((a, b) => a.localeCompare(b));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeVerwendeteAuswahloptionen", async () => {
    const { Variante, KeinElterngeld } = await import("@/monatsplaner");

    it("ignoriert Bonus weil es in keinem Beispiel vorkommt", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "Testbeispiel",
        titel: "Testbeispiel",
        beschreibung: "Beispiel mit nur Basis und Plus aber kein Bonus",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date("2024-01-01"),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false,
              },
            },
            3: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false,
              },
            },
          },
        },
      };

      const optionen = findeVerwendeteAuswahloptionen([beispiel]);

      expect(optionen).toEqual([Variante.Basis, Variante.Plus]);
    });

    it("erstellt Reihenfolge Basis, Plus und dann kein Elterngeld", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "Testbeispiel",
        titel: "Testbeispiel",
        beschreibung: "Beispiel mit nur Basis und Plus aber kein Bonus",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date("2024-01-01"),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Plus,
                imMutterschutz: false,
              },
            },
            3: {
              [Elternteil.Eins]: {
                gewaehlteOption: undefined,
                imMutterschutz: false,
              },
            },
          },
        },
      };

      const optionen = findeVerwendeteAuswahloptionen([beispiel]);

      expect(optionen).toEqual([Variante.Basis, Variante.Plus, KeinElterngeld]);
    });

    it("behandelt undefined wie kein Elterngeld weil es in der Legende sichtbar sein soll", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "Testbeispiel",
        titel: "Testbeispiel",
        beschreibung: "Beispiel mit nur Basis und Plus aber kein Bonus",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date("2024-01-01"),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: undefined,
                imMutterschutz: false,
              },
            },
          },
        },
      };

      const optionen = findeVerwendeteAuswahloptionen([beispiel]);

      expect(optionen).toEqual([KeinElterngeld]);
    });
  });
}
