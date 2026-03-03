import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";

import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeAlleinerziehend(events: FormEvent[]): boolean {
  const event = [...events]
    .reverse()
    .find((event): event is ElternteilAllgemeineAngabenEvent => {
      return event.route === Route.ElternteilAllgemeineAngaben;
    });

  if (!event) {
    throw new Error(`No Allgemeine Angaben event found.`);
  }

  return event.payload.istAlleinerziehend;
}

type ElternteilAllgemeineAngabenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilAllgemeineAngaben }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeMinijob", () => {
    it("throws when no event exists", () => {
      expect(() => findeAlleinerziehend([])).toThrow();
    });

    it("throws when no event exists for the given route", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 1, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: true },
        },
      ];

      expect(() => findeAlleinerziehend(events)).toThrow();
    });

    it("returns the istAlleinerziehend value", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Person 1",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
      ];

      expect(findeAlleinerziehend(events)).toEqual(true);
    });

    it("returns the most recent istAlleinerziehend value", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Person 1",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        },
        {
          route: Route.ElternteilAllgemeineAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            name: "Person 1",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        },
      ];

      expect(findeAlleinerziehend(events)).toEqual(false);
    });
  });
}
