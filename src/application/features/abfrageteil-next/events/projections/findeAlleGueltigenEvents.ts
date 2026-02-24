import { filtereValideEventHistorie } from "./filtereValideEventHistorie";

import type {
  FormEvent,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing";

export function findeAlleGueltigenEvents<R extends FormEvent["route"]>(
  eventStream: FormEvent[],
  route: R,
): PayloadMap[R][] {
  return filtereValideEventHistorie(eventStream)
    .filter((e): e is EventWithRoute<R> => e.route === route)
    .map((e) => e.payload);
}

type EventWithRoute<R extends FormEvent["route"]> = Extract<
  FormEvent,
  { route: R; payload: PayloadMap[R] }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeAlleGueltigenEvents", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    const { Route } =
      await import("@/application/features/abfrageteil-next/routing");

    it("returns payloads for all matching events in the valid history", () => {
      const eventStream: FormEvent[] = [
        { route: Route.Startseite },
        {
          route: Route.GeschwisterkindAbfrage,
          payload: { istVorhanden: true },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-01-01"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2018-06-15"),
            hatBehinderung: true,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      const result = findeAlleGueltigenEvents(
        eventStream,
        Route.GeschwisterkindAngaben,
      );

      expect(result).toEqual([
        {
          geburtsdatum: Temporal.PlainDate.from("2020-01-01"),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
        {
          geburtsdatum: Temporal.PlainDate.from("2018-06-15"),
          hatBehinderung: true,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      ]);
    });

    it("returns an empty array when no events match the route", () => {
      const eventStream: FormEvent[] = [{ route: Route.Startseite }];

      const result = findeAlleGueltigenEvents(
        eventStream,
        Route.GeschwisterkindAngaben,
      );

      expect(result).toEqual([]);
    });
  });
}
