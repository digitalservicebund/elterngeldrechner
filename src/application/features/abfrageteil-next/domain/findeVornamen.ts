import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil-next/events/projections/findeLetztesGueltigesEvent";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeVornamen(
  events: FormEvent[],
  elternteilIndex: number,
): string {
  const route = findeRouteByElternteilIndex(elternteilIndex);

  const letztesGueltigesEvent = findeLetztesGueltigesEvent(events, route);

  return letztesGueltigesEvent?.name ?? `Person ${elternteilIndex + 1}`;
}

function findeRouteByElternteilIndex(elternteilIndex: number) {
  if (elternteilIndex === 0) {
    return Route.ElternteilEinsAllgemeineAngaben;
  } else {
    return Route.ElternteilZweiAllgemeineAngaben;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeVornamen", () => {
    it("returns 'Person 1' when no event exists and elternteilIndex 0", () => {
      expect(findeVornamen([], 0)).toEqual("Person 1");
    });

    it("returns 'Person 2' when no event exists and elternteilIndex 1", () => {
      expect(findeVornamen([], 1)).toEqual("Person 2");
    });

    it("returns the name of the first person when elternteilIndex 0", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Britta",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
      ];

      expect(findeVornamen(events, 0)).toEqual("Britta");
    });

    it("returns the most recent name of the first person when elternteilIndex 0", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Anja",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Britta",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
      ];

      expect(findeVornamen(events, 0)).toEqual("Britta");
    });

    it("returns the name of the second person when elternteilIndex 1", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Anja",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
            name: "Anton",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ];

      expect(findeVornamen(events, 1)).toEqual("Anton");
    });

    it("returns the most recent name of the second person when elternteilIndex 1", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Anja",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
            name: "Anton",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
            name: "Daniel",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        },
      ];

      expect(findeVornamen(events, 1)).toEqual("Daniel");
    });
  });
}
