import type { TaetigkeitNichtSelbststaendigMinijobAbfrage } from "@/application/features/abfrageteil-next/pages/taetigkeit/TaetigkeitSchema";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeMinijob(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeitIndex: number,
): TaetigkeitNichtSelbststaendigMinijobAbfrage {
  const event = [...events]
    .reverse()
    .find((event): event is MinijobAbfrageEvent => {
      return (
        event.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig &&
        event.params.elternteilIndex === elternteilIndex &&
        event.params.taetigkeitIndex === taetigkeitIndex
      );
    });

  if (!event) {
    throw new Error(
      `No Minijob event found for elternteilIndex ${elternteilIndex}, taetigkeitIndex ${taetigkeitIndex}.`,
    );
  }

  return event.payload;
}

type MinijobAbfrageEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeMinijob", () => {
    it("throws when no event exists", () => {
      expect(() => findeMinijob([], 0, 0)).toThrow();
    });

    it("throws when no event exists for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 1, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: true },
        },
      ];

      expect(() => findeMinijob(events, 0, 0)).toThrow();
    });

    it("throws when only events for taetigkeitIndex other than 0 exist", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 1 },
          payload: { istTaetigkeitMinijob: true },
        },
      ];

      expect(() => findeMinijob(events, 0, 0)).toThrow();
    });

    it("returns the payload for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: true },
        },
      ];

      expect(findeMinijob(events, 0, 0)).toEqual({
        istTaetigkeitMinijob: true,
      });
    });

    it("returns the most recent event for the given elternteilIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: true },
        },
        {
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: { istTaetigkeitMinijob: false },
        },
      ];

      expect(findeMinijob(events, 0, 0)).toEqual({
        istTaetigkeitMinijob: false,
      });
    });
  });
}
