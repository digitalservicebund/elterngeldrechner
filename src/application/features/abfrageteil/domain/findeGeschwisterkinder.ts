import type { GeschwisterkindAngaben } from "@/application/features/abfrageteil/pages/geschwister/GeschwisterSchema";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";

export function findeGeschwisterkinder(
  events: FormEvent[],
): GeschwisterkindAngaben[] {
  const byIndex = new Map<number, GeschwisterkindAngaben>();

  for (const event of events) {
    if (isGeschwisterkindAngabenEvent(event)) {
      byIndex.set(event.params.geschwisterkindIndex, event.payload);
    }
  }

  return Array.from(byIndex.keys())
    .sort((a, b) => a - b)
    .map((index) => byIndex.get(index) as GeschwisterkindAngaben);
}

type GeschwisterkindAngabenEvent = Extract<
  FormEvent,
  { route: Route.GeschwisterkindAngaben }
>;

function isGeschwisterkindAngabenEvent(
  event: FormEvent,
): event is GeschwisterkindAngabenEvent {
  return event.route === Route.GeschwisterkindAngaben;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeGeschwisterkinder", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    it("returns empty array when no GeschwisterkindAngaben events exist", () => {
      expect(findeGeschwisterkinder([])).toEqual([]);
    });

    it("returns a single Geschwisterkind", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2022-05-10"),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 1,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2022-05-10"),
          hatBehinderung: false,
        },
      ]);
    });

    it("returns multiple Geschwisterkinder ordered by index", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
            hatBehinderung: true,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 2,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 2,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
          hatBehinderung: false,
        },
        {
          geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
          hatBehinderung: true,
        },
      ]);
    });

    it("uses the most recent event for a given geschwisterIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-01-01"),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 1,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
            hatBehinderung: true,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 1,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
          hatBehinderung: true,
        },
      ]);
    });
  });
}
