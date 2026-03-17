import { findeTaetigkeiten } from "./findeTaetigkeiten";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function ueberpruefeErwerbstaetigkeit(
  events: FormEvent[],
  elternteilIndex: number,
): boolean {
  try {
    const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);

    if (taetigkeiten.hatKeinEinkommen) {
      return false;
    }

    const { istNichtSelbststaendig, istSelbststaendig, istVerbeamtet } =
      taetigkeiten;

    return istNichtSelbststaendig || istSelbststaendig || istVerbeamtet;
  } catch {
    return false;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("hatErwerbstaetigkeit", () => {
    it("returns false if no event for given elternteil exists", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 1)).toEqual(false);
    });

    it("returns false if hatKeinEinkommen for given elternteil is true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(false);
    });

    it("returns false if hatKeinEinkommen for given elternteil is false and only hatAndereLeistungen true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(false);
    });

    it("returns true if hatKeinEinkommen for given elternteil is false and istSelbststaendig true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: true,
            istNichtSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });

    it("returns true if hatKeinEinkommen for given elternteil is false and istNichtSelbststaendig true even if also hatAndereLeistungen is true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });

    it("returns true if hatKeinEinkommen for given elternteil is false and only istVerbeamtet true", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: false,
            istSelbststaendig: false,
            istNichtSelbststaendig: false,
            istVerbeamtet: true,
            hatAndereLeistungen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
      ];

      expect(ueberpruefeErwerbstaetigkeit(events, 0)).toEqual(true);
    });
  });
}
