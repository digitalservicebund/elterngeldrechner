import { Temporal } from "@js-temporal/polyfill";
import {
  type Event,
  Route,
  generatePathFromEvent,
  getNextRoute,
} from "./Router";

type EventLog = [Event, ...Event[]];

function filtereValidenEventPfad(eventLog: EventLog): Event[] {
  return eventLog
    .reduceRight(
      (acc, event) => {
        const letzteEventRoute = generatePathFromEvent(acc[acc.length - 1]!);
        const istVorherigesEvent = getNextRoute(event) === letzteEventRoute;

        return [...acc, ...(istVorherigesEvent ? [event] : [])];
      },
      [eventLog[eventLog.length - 1] as Event],
    )
    .toReversed();
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("filtereValidenEventPfad", () => {
    it("returns all events when no events are skipped", () => {
      const eventLog: EventLog = [
        { route: Route.Startseite },
        { route: Route.AllgemeineAngaben },
        {
          route: Route.KindAbfrage,
          payload: {
            istGeboren: true,
          },
        },
      ];

      const result: Event[] = filtereValidenEventPfad(eventLog);

      expect(result).toEqual(eventLog);
    });

    it("skips old KindAbfrage event when newer one exists with different payload", () => {
      const eventLog: EventLog = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
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

      const result = filtereValidenEventPfad(eventLog);

      expect(result).toEqual([
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
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
      const eventLog: EventLog = [
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
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

      const result = filtereValidenEventPfad(eventLog);

      expect(result).toEqual([
        { route: Route.Startseite },
        {
          route: Route.AllgemeineAngaben,
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
