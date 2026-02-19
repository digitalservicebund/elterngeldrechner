import { Temporal } from "@js-temporal/polyfill";
import { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import type {
  FormEvent,
  ParamsMap,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing";

export function findeLetztesGueltigesEvent<R extends FormEvent["route"]>(
  eventStream: EventStream,
  route: R,
  ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
): PayloadMap[R] | undefined {
  const params = args[0];

  const lastEvent = eventStream.findLast((event) => {
    if (event.route !== route) {
      return false;
    }

    if (params && "params" in event) {
      return Object.entries(params).every(([key, value]) => {
        return (
          key in event.params &&
          event.params[key as keyof typeof event.params] === value
        );
      });
    }

    return true;
  });

  return lastEvent?.payload as PayloadMap[R] | undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeLetztesGueltigesEvent", async () => {
    const { Route } =
      await import("@/application/features/abfrageteil-next/routing");

    it("it returns the last object matching the route", () => {
      const result = findeLetztesGueltigesEvent(
        [
          { route: Route.Startseite },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: true,
            },
          },
        ],
        Route.AllgemeineAngaben,
      );

      expect(result).toEqual({
        bundesland: "Berlin",
        gesamteinkommenGrenzeUeberschritten: true,
      });
    });

    it("it returns the last object matching the route and the geschwisterIndex", () => {
      const result = findeLetztesGueltigesEvent(
        [
          { route: Route.Startseite },
          {
            route: Route.GeschwisterkindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              hatBehinderung: false,
              istWeiteresGeschwisterkindVorhanden: true,
            },
            params: {
              geschwisterIndex: 0,
            },
          },
          {
            route: Route.GeschwisterkindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2023-12-23"),
              hatBehinderung: false,
              istWeiteresGeschwisterkindVorhanden: false,
            },
            params: {
              geschwisterIndex: 1,
            },
          },
        ],
        Route.GeschwisterkindAngaben,
        { geschwisterIndex: 0 },
      );

      expect(result).toEqual({
        geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
        hatBehinderung: false,
        istWeiteresGeschwisterkindVorhanden: true,
      });
    });

    it("it returns the last object matching the route and the elternteilIndex", () => {
      const result = findeLetztesGueltigesEvent(
        [
          { route: Route.Startseite },
          {
            route: Route.ElternteilAllgemeineAngaben,
            payload: {
              name: "Anna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
            params: {
              elternteilIndex: 0,
            },
          },
          {
            route: Route.ElternteilAllgemeineAngaben,
            payload: {
              name: "Ben",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
            params: {
              elternteilIndex: 1,
            },
          },
        ],
        Route.ElternteilAllgemeineAngaben,
        { elternteilIndex: 0 },
      );

      expect(result).toEqual({
        name: "Anna",
        istAlleinerziehend: false,
        istImMutterschutz: true,
      });
    });

    it("it returns undefined if no object matches the route", () => {
      const result = findeLetztesGueltigesEvent(
        [{ route: Route.Startseite }],
        Route.AllgemeineAngaben,
      );

      expect(result).toBeUndefined();
    });
  });
}
