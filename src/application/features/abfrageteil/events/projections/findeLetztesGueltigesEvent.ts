import { Temporal } from "@js-temporal/polyfill";
import type { FormEvent, ParamsMap, PayloadMap } from "@/application/routing";

export function findeLetztesGueltigesEvent<R extends FormEvent["route"]>(
  eventStream: FormEvent[],
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
    const { Route } = await import("@/application/routing");

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
            route: Route.GeschwisterkindAnzahlAbfrage,
            payload: { anzahlGeschwisterkinder: 2 },
          },
          {
            route: Route.GeschwisterkindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              hatBehinderung: false,
            },
            params: {
              geschwisterkindIndex: 0,
            },
            dependentValues: {
              anzahlGeschwisterkinder: 2,
            },
          },
          {
            route: Route.GeschwisterkindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2023-12-23"),
              hatBehinderung: false,
            },
            params: {
              geschwisterkindIndex: 1,
            },
            dependentValues: {
              anzahlGeschwisterkinder: 2,
            },
          },
        ],
        Route.GeschwisterkindAngaben,
        { geschwisterkindIndex: 0 },
      );

      expect(result).toEqual({
        geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
        hatBehinderung: false,
      });
    });

    it("it returns the last object matching the route and the elternteilIndex", () => {
      const result = findeLetztesGueltigesEvent(
        [
          { route: Route.Startseite },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Anna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
          },
          {
            route: Route.ElternteilEinsAllgemeineAngaben,
            payload: {
              name: "Ben",
              istAlleinerziehend: false,
              istImMutterschutz: false,
            },
          },
        ],
        Route.ElternteilEinsAllgemeineAngaben,
      );

      expect(result).toEqual({
        name: "Ben",
        istAlleinerziehend: false,
        istImMutterschutz: false,
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
