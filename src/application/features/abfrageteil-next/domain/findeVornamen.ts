import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";

import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeVornamen(
  events: FormEvent[],
  elternteilIndex: number,
): string {
  if (elternteilIndex === 0) {
    const event = [...events]
      .reverse()
      .find((event): event is ElternteilEinsAllgemeineAngabenEvent => {
        return event.route === Route.ElternteilEinsAllgemeineAngaben;
      });

    return event?.payload.name ?? "Person 1";
  }

  const event = [...events]
    .reverse()
    .find((event): event is ElternteilZweiAllgemeineAngabenEvent => {
      return event.route === Route.ElternteilZweiAllgemeineAngaben;
    });

  return event?.payload.name ?? "Person 2";
}

type ElternteilEinsAllgemeineAngabenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilEinsAllgemeineAngaben }
>;

type ElternteilZweiAllgemeineAngabenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilZweiAllgemeineAngaben }
>;

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
