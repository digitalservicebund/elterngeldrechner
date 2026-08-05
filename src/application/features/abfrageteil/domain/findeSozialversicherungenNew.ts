import type { TaetigkeitenAngestelltHauptjob } from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import { Steuerklasse } from "@/elterngeldrechner";

export function findeSozialversicherungen(
  events: FormEvent[],
  elternteilIndex: number,
): TaetigkeitenAngestelltHauptjob {
  const hauptjobEvent = events.findLast(
    (e): e is HauptjobEvent =>
      e.route === Route.ElternteilTaetigkeitenAngestelltHauptjob &&
      e.params.elternteilIndex === elternteilIndex &&
      e.params.angestelltIndex === 0,
  );

  if (!hauptjobEvent) {
    throw new Error(
      `No Hauptjob event found for elternteil ${elternteilIndex}.`,
    );
  }

  return hauptjobEvent.payload;
}

type HauptjobEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitenAngestelltHauptjob }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeSozialversicherungen", () => {
    const hauptjobEvent: FormEvent = {
      route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
      params: { elternteilIndex: 0, angestelltIndex: 0 },
      payload: {
        steuerklasse: Steuerklasse.I,
        istKirchensteuerpflichtig: false,
        istGesetzlichKrankenpflichtversichert: true,
        istGesetzlichRentenversichert: true,
        istGesetzlichArbeitlosenversichert: true,
      },
      dependentValues: { kannDurchschnittAngegebenWerden: true },
    };

    it("throws when no Hauptjob event exists", () => {
      expect(() => findeSozialversicherungen([], 0)).toThrow();
    });

    it("throws when no Hauptjob event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          ...hauptjobEvent,
          params: { elternteilIndex: 1, angestelltIndex: 0 },
        },
      ];

      expect(() => findeSozialversicherungen(events, 0)).toThrow();
    });

    it("throws when only a Nebenjob (angestelltIndex > 0) event exists", () => {
      const events: FormEvent[] = [
        {
          ...hauptjobEvent,
          params: { elternteilIndex: 0, angestelltIndex: 1 },
        },
      ];

      expect(() => findeSozialversicherungen(events, 0)).toThrow();
    });

    it("returns the payload of the Hauptjob event for the given elternteilIndex", () => {
      const events: FormEvent[] = [hauptjobEvent];

      expect(findeSozialversicherungen(events, 0)).toEqual(
        hauptjobEvent.payload,
      );
    });

    it("returns the most recent Hauptjob event for the given elternteilIndex", () => {
      const updatedHauptjobEvent: FormEvent = {
        ...hauptjobEvent,
        payload: {
          ...hauptjobEvent.payload,
          istGesetzlichRentenversichert: false,
        },
      };

      const events: FormEvent[] = [hauptjobEvent, updatedHauptjobEvent];

      expect(findeSozialversicherungen(events, 0)).toEqual(
        updatedHauptjobEvent.payload,
      );
    });
  });
}
