import type { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import { filtereValidenEventPfad } from "@/application/features/abfrageteil-next/events/projections/filtereValidenEventPfad";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { generateAbfrageteilPath } from "@/application/features/abfrageteil-next/routing/routing";

function findeVorherigenPfad(eventStream: EventStream, route: Route): string {
  const validerEventPfad = filtereValidenEventPfad(eventStream).map(
    (event) => event.route,
  );

  const aktuelleRouteIndex = validerEventPfad.findIndex(
    (currentRoute) => currentRoute === route,
  );

  return generateAbfrageteilPath(
    (validerEventPfad[aktuelleRouteIndex - 1] || validerEventPfad.at(-1))!,
  );
}

export { findeVorherigenPfad };

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("findeVorherigenPfad", () => {
    it("returns /abfrageteil/allgemeine-angaben when called from /kind without the kind event in the event stream", () => {
      const vorherigerPfad = findeVorherigenPfad(
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

      expect(vorherigerPfad).toEqual("/abfrageteil/allgemeine-angaben");
    });

    it("returns /abfrageteil/allgemeine-angaben when called from /kind with the kind event in the event stream", () => {
      const vorherigerPfad = findeVorherigenPfad(
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

      expect(vorherigerPfad).toEqual("/abfrageteil/allgemeine-angaben");
    });
  });
}
