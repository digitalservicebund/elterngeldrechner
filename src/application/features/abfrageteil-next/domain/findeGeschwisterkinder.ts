import type { GeschwisterkindAngaben } from "@/application/features/abfrageteil-next/geschwister/GeschwisterSchema";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

export function findeGeschwisterkinder(
  events: FormEvent[],
): GeschwisterkindAngaben[] {
  const byIndex = new Map<number, GeschwisterkindAngaben>();

  for (const event of events) {
    if (isGeschwisterkindAngabenEvent(event)) {
      byIndex.set(event.params.geschwisterIndex, event.payload);
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
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2022-05-10"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2022-05-10"),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      ]);
    });

    it("returns multiple Geschwisterkinder ordered by index", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
            hatBehinderung: true,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
        {
          geburtsdatum: Temporal.PlainDate.from("2022-07-01"),
          hatBehinderung: true,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      ]);
    });

    it("uses the most recent event for a given geschwisterIndex", () => {
      const events: FormEvent[] = [
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-01-01"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
            hatBehinderung: true,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      expect(findeGeschwisterkinder(events)).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2020-03-15"),
          hatBehinderung: true,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      ]);
    });
  });
}
