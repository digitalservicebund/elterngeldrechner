import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { TaetigkeitNichtSelbststaendigAngaben } from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import { Steuerklasse } from "@/elterngeldrechner";

export function findeSozialversicherungen(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeitIndex: number,
): TaetigkeitNichtSelbststaendigAngaben {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitAngabenSozialversicherungen,
    { elternteilIndex, taetigkeitIndex },
  );

  if (!letztesGueltigesEvent) {
    throw new Error(
      `No Sozialversicherungen event found for elternteil ${elternteilIndex}, taetigkeitIndex ${taetigkeitIndex}.`,
    );
  }

  return letztesGueltigesEvent;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeSozialversicherungen", () => {
    const sozialversicherungEvent = {
      steuerklasse: Steuerklasse.I,
      istKirchensteuerpflichtig: false,
      istGesetzlichKrankenpflichtversichert: true,
      istGesetzlichRentenversichert: true,
      istGesetzlichArbeitlosenversichert: true,
      istEinkommenGleichVerteilt: true,
    };

    it("throws when no event exists", () => {
      expect(() => findeSozialversicherungen([], 0, 0)).toThrow();
    });

    it("throws when no event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 1, taetigkeitIndex: 0 },
          payload: sozialversicherungEvent,
        },
      ];

      expect(() => findeSozialversicherungen(events, 0, 0)).toThrow();
    });

    it("throws when only events for taetigkeitIndex other than 0 exist", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 1 },
          payload: sozialversicherungEvent,
        },
      ];

      expect(() => findeSozialversicherungen(events, 0, 0)).toThrow();
    });

    it("returns the payload for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: sozialversicherungEvent,
        },
      ];

      expect(findeSozialversicherungen(events, 0, 0)).toEqual(
        sozialversicherungEvent,
      );
    });

    it("returns the most recent event for the given elternteilIndex", () => {
      const updatedSozialversicherungen = {
        ...sozialversicherungEvent,
        istGesetzlichRentenversichert: false,
      };

      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: sozialversicherungEvent,
        },
        {
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: updatedSozialversicherungen,
        },
      ];

      expect(findeSozialversicherungen(events, 0, 0)).toEqual(
        updatedSozialversicherungen,
      );
    });
  });
}
