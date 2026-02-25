import type { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil-next/pages/elternteil";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeTaetigkeiten(
  events: FormEvent[],
  elternteilIndex: number,
): ElternteilTaetigkeitenAbfrage {
  const event = [...events]
    .reverse()
    .find((event): event is TaetigkeitenAbfrageEvent => {
      return (
        event.route === Route.ElternteilTaetigkeitenAbfrage &&
        event.params.elternteilIndex === elternteilIndex
      );
    });

  if (!event) {
    throw new Error(
      `No Taetigkeiten event found for elternteil ${elternteilIndex}.`,
    );
  }

  return event.payload;
}

type TaetigkeitenAbfrageEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitenAbfrage }
>;

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
          payload: { hatKeinEinkommen: true },
        },
      ];

      expect(() => findeTaetigkeiten(events, 0)).toThrow();
    });

    it("returns the payload for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
        },
      ];

      expect(findeTaetigkeiten(events, 0)).toEqual({
        hatKeinEinkommen: true,
      });
    });

    it("returns the most recent event for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
        },
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
        },
      ];

      expect(findeTaetigkeiten(events, 0)).toEqual({
        hatKeinEinkommen: false,
        istSelbststaendig: true,
        istNichtSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });
    });
  });
}
