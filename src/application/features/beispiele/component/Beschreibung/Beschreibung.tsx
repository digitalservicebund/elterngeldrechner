import { Geldbetrag } from "@/application/components";
import { Beispiel } from "@/application/features/beispiele";
import {
  type Ausgangslage,
  type AusgangslageFuerEinElternteil,
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
        <p className="mb-8">Elterngeld Summe</p>

        <p className="inline-block rounded bg-primary-light px-10 py-2">
          <Geldbetrag betrag={gesamtbezug} />
        </p>
      </div>

      <div className="col-span-2">
        <p className="mb-8">Elterngeld bis zum</p>

        <p className="inline-block rounded bg-primary-light px-10 py-2">
          {letzterLebensmonat}. Lebensmonat
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
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date(),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false as const,
                elterngeldbezug: 100,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false as const,
                elterngeldbezug: 200,
              },
            },
          },
        },
      };

      render(<Beschreibung beispiel={beispiel} />);

      expect(screen.getByText("Elterngeld Summe")).toBeVisible();
      expect(screen.getByText("300 €")).toBeVisible();
    });

    it("renders the letzten lebensmonat of the given beispiel", () => {
      const beispiel: Beispiel<AusgangslageFuerEinElternteil> = {
        identifier: "test-beispiel",
        titel: "Test Beispiel",
        plan: {
          ausgangslage: {
            anzahlElternteile: 1,
            geburtsdatumDesKindes: new Date(),
          },
          lebensmonate: {
            1: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false as const,
                elterngeldbezug: 100,
              },
            },
            2: {
              [Elternteil.Eins]: {
                gewaehlteOption: Variante.Basis,
                imMutterschutz: false as const,
                elterngeldbezug: 200,
              },
            },
            3: {
              [Elternteil.Eins]: {
                gewaehlteOption: KeinElterngeld,
                imMutterschutz: false as const,
              },
            },
          },
        },
      };

      render(<Beschreibung beispiel={beispiel} />);

      expect(screen.getByText("Elterngeld bis zum")).toBeVisible();
      expect(screen.getByText("2. Lebensmonat")).toBeVisible();
    });
  });
}
