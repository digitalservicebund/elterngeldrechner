import { Temporal } from "@js-temporal/polyfill";
import { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import {
  FormEvent,
  PayloadMap,
} from "@/application/features/abfrageteil-next/routing/routing";

export function findeLetztesGueltigesEvent<R extends FormEvent["route"]>(
  eventStream: EventStream,
  route: R,
  index?: number,
): PayloadMap[R] | undefined {
  const lastEvent = eventStream.findLast((event) => {
    if (typeof index === "number" && "params" in event) {
      return event.route === route && event.params.index === index;
    }
    return event.route === route;
  });

  return lastEvent?.payload as PayloadMap[R] | undefined;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeLetztesGueltigesEvent", async () => {
    const { Route } =
      await import("@/application/features/abfrageteil-next/routing/Route");

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

    it("it returns the last object matching the route and the index", () => {
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
              index: 0,
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
              index: 1,
            },
          },
        ],
        Route.GeschwisterkindAngaben,
        0,
      );

      expect(result).toEqual({
        geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
        hatBehinderung: false,
        istWeiteresGeschwisterkindVorhanden: true,
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
