import { Temporal } from "@js-temporal/polyfill";
import { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  type FormEvent,
  findeNaechstenPfad,
  generatePathFromEvent,
} from "@/application/features/abfrageteil-next/routing/routing";

export function filtereValideEventHistorie(
  eventStream: EventStream,
): FormEvent[] {
  return eventStream
    .reduceRight(
      (acc, event) => {
        const letzerEventPfad = generatePathFromEvent(acc[acc.length - 1]!);
        const naechsterPfad = findeNaechstenPfad(event);

        const istVorherigesEvent = naechsterPfad === letzerEventPfad;

        return [...acc, ...(istVorherigesEvent ? [event] : [])];
      },
      [eventStream[eventStream.length - 1] as FormEvent],
    )
    .toReversed();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("filtereValideEventHistorie", () => {
    it("returns all events when no events are skipped", () => {
      const eventStream: EventStream = [
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
      ];

      const result: FormEvent[] = filtereValideEventHistorie(eventStream);

      expect(result).toEqual(eventStream);
    });

    it("skips old KindAbfrage event when newer one exists with different payload", () => {
      const eventStream: EventStream = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
          payload: {
            bundesland: "Berlin",
            gesamteinkommenGrenzeUeberschritten: false,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: false } },
        {
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
        { route: Route.KindAbfrage, payload: { istGeboren: true } },
        {
          route: Route.GeborenesKindAngaben,
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2025-12-23"),
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
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
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
            anzahl: 1,
          },
        },
      ]);
    });

    it("skips GeschwisterkindAngaben events when user changes istVorhanden to false", () => {
      const eventStream: EventStream = [
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
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
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
            geburtsdatum: Temporal.PlainDate.from("2018-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      const result = filtereValideEventHistorie(eventStream);

      expect(result).toEqual([
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
            errechneterEntbindungstermin: Temporal.PlainDate.from("2025-12-23"),
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
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ]);
    });
  });
}
