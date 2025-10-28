import { Geldbetrag } from "@/application/components";
import { Beispiel } from "@/application/features/beispiele";
import {
  type Ausgangslage,
  type AusgangslageFuerEinElternteil,
  type Auswahloption,
  berechneGesamtsumme,
  bestimmeLetztenGeplantenLebensmonat,
} from "@/monatsplaner";

type Props = {
  readonly beispiel: Beispiel<Ausgangslage>;
};

export function Beschreibung({ beispiel }: Props) {
  const gesamtbezug = berechneGesamtsumme(beispiel.plan).elterngeldbezug;
  const letzterLebensmonat = bestimmeLetztenGeplantenLebensmonat(beispiel.plan);

  return (
    <>
      <div className="col-span-2">
        <p className="mb-8">
          <Geldbetrag betrag={gesamtbezug} /> Elterngeld
        </p>
      </div>

      <div className="col-span-2">
        <p className="mb-8 truncate">
          {letzterLebensmonat} Lebensmonate Elterngeld
        </p>
      </div>
    </>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("Beschreibung", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { Elternteil, Variante, KeinElterngeld } = await import(
      "@/monatsplaner"
    );

    it("renders the gesammtsumme of the given beispiel", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "test-beispiel",
        titel: "Test Beispiel",
        beschreibung: "Beispiel mit zwei Monaten Elterngeldbezug.",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date(),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 100),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis, 200),
            },
          },
        },
      };

      render(<Beschreibung beispiel={beispiel} />);

      expect(screen.getByText("300 € Elterngeld")).toBeVisible();
    });

    it("renders the letzten lebensmonat of the given beispiel", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "test-beispiel",
        titel: "Test Beispiel",
        beschreibung: "Beispiel mit zwei Monaten Elterngeldbezug.",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date(),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: monat(Variante.Basis, 100),
            },
            2: {
              [Elternteil.Eins]: monat(Variante.Basis, 200),
            },
            3: {
              [Elternteil.Eins]: monat(KeinElterngeld),
            },
          },
        },
      };

      render(<Beschreibung beispiel={beispiel} />);

      expect(screen.getByText("2 Lebensmonate Elterngeld")).toBeVisible();
    });

    function monat(gewaehlteOption: Auswahloption, elterngeldbezug?: number) {
      return {
        gewaehlteOption,
        imMutterschutz: false as const,
        elterngeldbezug: elterngeldbezug ? elterngeldbezug : undefined,
      };
    }
  });
}
