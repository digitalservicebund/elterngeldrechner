import { Temporal } from "@js-temporal/polyfill";
import { EventStream } from "@/application/features/abfrageteil-next/events/EventStream";
import {
  type FormEvent,
  Route,
  generatePathFromEvent,
  getNextRoute,
} from "@/application/features/abfrageteil-next/routing/routing";

export function filtereValidenEventPfad(eventStream: EventStream): FormEvent[] {
  return eventStream
    .reduceRight(
      (acc, event) => {
        const letzteEventRoute = generatePathFromEvent(acc[acc.length - 1]!);
        const istVorherigesEvent = getNextRoute(event) === letzteEventRoute;

        return [...acc, ...(istVorherigesEvent ? [event] : [])];
      },
      [eventStream[eventStream.length - 1] as FormEvent],
    )
    .toReversed();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("filtereValidenEventPfad", () => {
    it("returns all events when no events are skipped", () => {
      const eventStream: EventStream = [
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

      const result: FormEvent[] = filtereValidenEventPfad(eventStream);

      expect(result).toEqual(eventStream);
    });

    it("skips old KindAbfrage event when newer one exists with different payload", () => {
      const eventStream: EventStream = [
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

      const result = filtereValidenEventPfad(eventStream);

      expect(result).toEqual([
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
          params: { index: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2020-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { index: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2018-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { index: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { index: 1 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2010-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: false,
          },
        },
      ];

      const result = filtereValidenEventPfad(eventStream);

      expect(result).toEqual([
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
          params: { index: 0 },
          payload: {
            geburtsdatum: Temporal.PlainDate.from("2013-12-23"),
            hatBehinderung: false,
            istWeiteresGeschwisterkindVorhanden: true,
          },
        },
        {
          route: Route.GeschwisterkindAngaben,
          params: { index: 1 },
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
