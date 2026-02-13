import type { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import { filtereValidenEventPfad } from "@/application/features/abfrageteil-next/events/projections/filtereValidenEventPfad";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";

function findeVorherigeRoute(eventStream: EventStream, route: Route): Route {
  const validerEventPfad = filtereValidenEventPfad(eventStream).map(
    (event) => event.route,
  );

  const aktuelleRouteIndex = validerEventPfad.findIndex(
    (currentRoute) => currentRoute === route,
  );

  return (validerEventPfad[aktuelleRouteIndex - 1] || validerEventPfad.at(-1))!;
}

export { findeVorherigeRoute };

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeVorherigeRoute", () => {
    it("returns /allgemeine-angaben when called from /kind without the kind event in the event stream", () => {
      const lastRoute = findeVorherigeRoute(
        [
          { route: Route.Startseite },
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

      expect(lastRoute).toContain("/allgemeine-angaben");
    });

    it("returns /allgemeine-angaben when called from /kind with the kind event in the event stream", () => {
      const lastRoute = findeVorherigeRoute(
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
            route: Route.KindAbfrage,
            payload: {
              istGeboren: true,
            },
          },
        ],
        Route.KindAbfrage,
      );

      expect(lastRoute).toContain("/allgemeine-angaben");
    });
  });
}
