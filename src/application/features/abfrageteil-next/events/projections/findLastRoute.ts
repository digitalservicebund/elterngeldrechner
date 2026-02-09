import type { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import { filtereValidenEventPfad } from "@/application/features/abfrageteil-next/events/projections/filtereValidenEventPfad";
import { Route } from "@/application/features/abfrageteil-next/routing/routing";

function findLastRoute(eventStream: EventStream, route: Route): Route {
  const validerEventPfad = filtereValidenEventPfad(eventStream).map(
    (event) => event.route,
  );

  const aktuelleRouteIndex = validerEventPfad.findIndex(
    (currentRoute) => currentRoute === route,
  );

  return (validerEventPfad[aktuelleRouteIndex - 1] || validerEventPfad.at(-1))!;
}

export { findLastRoute };

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findLastRoute", () => {
    it("returns /allgemeine-angaben when called from /kind without the kind event in the event stream", () => {
      const lastRoute = findLastRoute(
        [
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
        ],
        Route.KindAbfrage,
      );

      expect(lastRoute).toEqual("/allgemeine-angaben");
    });

    it("returns /allgemeine-angaben when called from /kind with the kind event in the event stream", () => {
      const lastRoute = findLastRoute(
        [
          {
            route: Route.AllgemeineAngaben,
            payload: {
              bundesland: "Berlin",
              gesamteinkommenGrenzeUeberschritten: false,
            },
          },
          {
            route: Route.KindAbfrage,
            payload: {
              istGeboren: true,
            },
          },
        ],
        Route.KindAbfrage,
      );

      expect(lastRoute).toEqual("/allgemeine-angaben");
    });
  });
}
