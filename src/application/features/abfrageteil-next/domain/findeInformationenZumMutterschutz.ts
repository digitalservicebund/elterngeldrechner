import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil-next/events/projections";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { Elternteil } from "@/monatsplaner/Elternteil";
import type { InformationenZumMutterschutz } from "@/monatsplaner/InformationenZumMutterschutz";

export function findeInformationenZumMutterschutz(
  events: FormEvent[],
  anzahlKinder: number,
): InformationenZumMutterschutz<Elternteil.Eins | Elternteil.Zwei> | undefined {
  const letzterLebensmonatMitSchutz = anzahlKinder > 1 ? 3 : 2;

  const elternteil1 = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilEinsAllgemeineAngaben,
  );

  if (elternteil1?.istImMutterschutz) {
    return { empfaenger: Elternteil.Eins, letzterLebensmonatMitSchutz };
  }

  const elternteil2 = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilZweiAllgemeineAngaben,
  );

  if (elternteil2?.istImMutterschutz) {
    return { empfaenger: Elternteil.Zwei, letzterLebensmonatMitSchutz };
  }

  return undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeInformationenZumMutterschutz", () => {
    const elternteil1OhneMutterschutz: FormEvent = {
      route: Route.ElternteilEinsAllgemeineAngaben,
      payload: {
        name: "Hanna",
        istAlleinerziehend: false,
        istImMutterschutz: false,
      },
    };

    const elternteil1MitMutterschutz: FormEvent = {
      route: Route.ElternteilEinsAllgemeineAngaben,
      payload: {
        name: "Hanna",
        istAlleinerziehend: false,
        istImMutterschutz: true,
      },
    };

    it("is undefined when Elternteil 1 is not in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1OhneMutterschutz],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("sets Elternteil.Eins as Empfänger when Elternteil 1 is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        1,
      );

      expect(result?.empfaenger).toEqual(Elternteil.Eins);
    });

    it("sets letzterLebensmonatMitSchutz to 2 for a single child", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(2);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge", () => {
      const result = findeInformationenZumMutterschutz(
        [elternteil1MitMutterschutz],
        2,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });

    it("is undefined when neither Elternteil is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
              name: "Max",
              istImMutterschutz: false,
            },
            dependentValues: { hatPotenzielleAusklammerungen: false },
          },
        ],
        1,
      );

      expect(result).toBeUndefined();
    });

    it("sets Elternteil.Zwei as Empfänger when Elternteil 2 is in Mutterschutz", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
              name: "Max",
              istImMutterschutz: true,
            },
            dependentValues: { hatPotenzielleAusklammerungen: false },
          },
        ],
        1,
      );

      expect(result?.empfaenger).toEqual(Elternteil.Zwei);
    });

    it("sets letzterLebensmonatMitSchutz to 2 for a single child (Elternteil 2)", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
              name: "Max",
              istImMutterschutz: true,
            },
            dependentValues: { hatPotenzielleAusklammerungen: false },
          },
        ],
        1,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(2);
    });

    it("sets letzterLebensmonatMitSchutz to 3 for Mehrlinge (Elternteil 2)", () => {
      const result = findeInformationenZumMutterschutz(
        [
          elternteil1OhneMutterschutz,
          {
            route: Route.ElternteilZweiAllgemeineAngaben,
            payload: {
              wirdZweitePersonBeruecksichtigt: true,
              name: "Max",
              istImMutterschutz: true,
            },
            dependentValues: { hatPotenzielleAusklammerungen: false },
          },
        ],
        2,
      );

      expect(result?.letzterLebensmonatMitSchutz).toEqual(3);
    });
  });
}
