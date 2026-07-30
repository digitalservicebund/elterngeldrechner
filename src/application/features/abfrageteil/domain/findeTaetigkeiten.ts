import { elternteilTaetigkeitenAbfrageRoute } from "@/application/feature-flags/useNewIncomeFlow";
import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";

export function findeTaetigkeiten(
  events: FormEvent[],
  elternteilIndex: number,
): ElternteilTaetigkeitenAbfrage {
  const letztesGueltigesEvent = findeLetztesGueltigesEvent(
    events,
    elternteilTaetigkeitenAbfrageRoute,
    {
      elternteilIndex,
    },
  );

  if (!letztesGueltigesEvent) {
    throw new Error(
      `No Taetigkeiten event found for elternteil ${elternteilIndex}.`,
    );
  }

  return letztesGueltigesEvent;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeTaetigkeiten", () => {
    it("throws when no event exists", () => {
      expect(() => findeTaetigkeiten([], 0)).toThrow();
    });

    it("throws when no event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 1 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(() => findeTaetigkeiten(events, 0)).toThrow();
    });

    it("returns the payload for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(findeTaetigkeiten(events, 0)).toEqual({
        istNichtSelbststaendig: false,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
        hatPeriodenOhneEinkommen: true,
      });
    });

    it("returns the most recent event for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatPeriodenOhneEinkommen: true,
            istSelbststaendig: true,
            istNichtSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(findeTaetigkeiten(events, 0)).toEqual({
        hatPeriodenOhneEinkommen: true,
        istSelbststaendig: true,
        istNichtSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });
    });
  });
}
