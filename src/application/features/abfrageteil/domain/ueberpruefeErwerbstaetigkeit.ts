import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil/events/projections";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";

export function ueberpruefeErwerbstaetigkeit(
  events: FormEvent[],
  elternteilIndex: number,
): boolean {
  const taetigkeiten = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenAbfrage,
    { elternteilIndex },
  );

  if (taetigkeiten === undefined) {
    return false;
  }

  const {
    istNichtSelbststaendig,
    hatMinijob,
    istSelbststaendig,
    istVerbeamtet,
  } = taetigkeiten;

  return Boolean(
    istNichtSelbststaendig || hatMinijob || istSelbststaendig || istVerbeamtet,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("hatErwerbstaetigkeit", () => {
    it("returns false if no event for given elternteil exists", () => {
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

      expect(ueberpruefeErwerbstaetigkeit(events, 1)).toEqual(false);
    });

    it("returns false if only hatPeriodenOhneEinkommen for given elternteil is true", () => {
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

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(false);
    });

    it("returns false if hatPeriodenOhneEinkommen for given elternteil is false and only hatAndereLeistungen true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatPeriodenOhneEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(false);
    });

    it("returns true no matter what value hatPeriodenOhneEinkommen has for given elternteil and istSelbststaendig true", () => {
      const events: FormEvent[] = [
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

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });

    it("returns true if hatPeriodenOhneEinkommen for given elternteil is false and istNichtSelbststaendig true even if also hatAndereLeistungen is true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatPeriodenOhneEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });

    it("returns true if hatPeriodenOhneEinkommen for given elternteil is false and only istVerbeamtet true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatPeriodenOhneEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: false,
            istVerbeamtet: true,
            hatAndereLeistungen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });

    it("returns true if only hatMinijob true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatPeriodenOhneEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: false,
            hatMinijob: true,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });
  });
}
