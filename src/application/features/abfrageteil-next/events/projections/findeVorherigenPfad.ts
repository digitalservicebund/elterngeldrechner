import { Temporal } from "@js-temporal/polyfill";
import type { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import { filtereValideEventHistorie } from "@/application/features/abfrageteil-next/events/projections";
import {
  type FormEvent,
  type ParamsMap,
  Route,
  generatePathFromEvent,
} from "@/application/features/abfrageteil-next/routing";

export function findeVorherigenPfad<R extends FormEvent["route"]>(
  eventStream: EventStream,
  route: R,
  ...args: ParamsMap[R] extends never ? [] : [params: ParamsMap[R]]
): string {
  const params = args[0];

  const valideEvents = filtereValideEventHistorie(eventStream);

  const aktuelleRouteIndex = valideEvents.findIndex((event) => {
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

  const vorherigesEvent =
    valideEvents[aktuelleRouteIndex - 1] ?? valideEvents.at(-1);

  return generatePathFromEvent(vorherigesEvent!);
}

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

    it("returns /abfrageteil/geschwisterkind/0 when called from elternteil/0 with geschwisterkind events", () => {
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
          { route: Route.KindAbfrage, payload: { istGeboren: true } },
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-12-23"),
              anzahl: 1,
            },
          },
          {
            route: Route.GeschwisterkindAbfrage,
            payload: { istVorhanden: true },
          },
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 0 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2020-12-23"),
              hatBehinderung: false,
              istWeiteresGeschwisterkindVorhanden: true,
            },
          },
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterIndex: 1 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2017-12-23"),
              hatBehinderung: false,
              istWeiteresGeschwisterkindVorhanden: false,
            },
          },
          {
            route: Route.ElternteilAllgemeineAngaben,
            params: { elternteilIndex: 0 },
            payload: {
              name: "Anna",
              istAlleinerziehend: false,
              istImMutterschutz: true,
            },
          },
        ],
        Route.ElternteilAllgemeineAngaben,
        { elternteilIndex: 0 },
      );

      expect(vorherigerPfad).toEqual("/abfrageteil/geschwisterkind/1");
    });
  });
}
