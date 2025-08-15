import type { ReactNode } from "react";
import { BeispielAuswahloptionPlakette } from "./BeispielAuswahloptionPlakette";
import { Beispiel } from "@/application/features/beispiele/hooks/erstelleBeispiele";
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

export function BeispielAuswahloptionLegende({ beispiele }: Props): ReactNode {
  const auswahloptionen = findeVerwendeteAuswahloptionen(beispiele);

  return (
    <ul className="flex flex-wrap gap-20">
      {auswahloptionen.map((option) => (
        <li key={option} className="flex items-center gap-10">
          <BeispielAuswahloptionPlakette
            auswahloption={option}
            className="h-[32px] w-[64px]"
          />
          <strong>{option}</strong>
        </li>
      ))}
    </ul>
  );
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
