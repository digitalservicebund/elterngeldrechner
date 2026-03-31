import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";

export function findeAnzahlGeschwister(events: FormEvent[]): number {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    Route.GeschwisterkindAnzahlAbfrage,
  );

  if (!letztesGueltigesEvent) {
    throw new Error(`No Geschwisterkind Anzahl Abfrage event found.`);
  }

  return letztesGueltigesEvent.anzahlGeschwister;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeAnzahlGeschwister", () => {
    it("throws when no event exists", () => {
      expect(() => findeAnzahlGeschwister([])).toThrow();
    });

    it("throws when no event exists for the given route", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 1, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: true },
          dependentValues: {
            kannDurchschnittAngegebenWerden: true,
          },
        },
      ];

      expect(() => findeAnzahlGeschwister(events)).toThrow();
    });

    it("returns the anzahlGeschwister value", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAnzahlAbfrage,
          payload: {
            anzahlGeschwister: 2,
          },
        },
      ];

      expect(findeAnzahlGeschwister(events)).toEqual(2);
    });

    it("returns the most recent anzahlGeschwister value", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAnzahlAbfrage,
          payload: {
            anzahlGeschwister: 2,
          },
        },
        {
          route: Route.GeschwisterkindAnzahlAbfrage,
          payload: {
            anzahlGeschwister: 3,
          },
        },
      ];

      expect(findeAnzahlGeschwister(events)).toEqual(3);
    });
  });
}
