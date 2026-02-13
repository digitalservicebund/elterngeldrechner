import { Temporal } from "@js-temporal/polyfill";
import { generatePath } from "react-router";
import { Route } from "./Route";
import { AllgemeineAngaben } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngabenSchema";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAngaben,
} from "@/application/features/abfrageteil-next/geschwister/GeschwisterSchema";
import {
  GeborenesKind,
  Geburt,
  UngeborenesKind,
  WahrscheinlichGeborenesKind,
} from "@/application/features/abfrageteil-next/kind/KindSchema";

export type FormRoutes = Exclude<Route, Route.Startseite>;

export type FormEvent =
  | { route: Route.Startseite; payload?: never }
  | { route: Route.AllgemeineAngaben; payload: AllgemeineAngaben }
  | { route: Route.KindAbfrage; payload: Geburt }
  | { route: Route.GeborenesKindAngaben; payload: GeborenesKind }
  | { route: Route.UngeborenesKindAngaben; payload: UngeborenesKind }
  | {
      route: Route.WahrscheinlichGeborenesKindAbfrage;
      payload: WahrscheinlichGeborenesKind;
    }
  | { route: Route.GeschwisterkindAbfrage; payload: GeschwisterkindAbfrage }
  | {
      route: Route.GeschwisterkindAngaben;
      params: { index: number };
      payload: GeschwisterkindAngaben;
    }
  | {
      route: Route.ElternteilAllgemeineAngaben;
      params: { index: number };
      payload: GeschwisterkindAbfrage;
    };

export type PayloadMap = {
  [E in FormEvent as E["route"]]: "payload" extends keyof E
    ? E["payload"]
    : never;
};

function paramsToStrings(
  params: Record<string, number>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value.toString()]),
  );
}

export function generatePathFromEvent(event: FormEvent) {
  return generatePath(
    event.route.toString(),
    "params" in event ? paramsToStrings(event.params) : undefined,
  );
}

export function getNextRoute(currentRoute: FormEvent): string {
  switch (currentRoute.route) {
    case Route.Startseite:
      return Route.AllgemeineAngaben;
    case Route.AllgemeineAngaben:
      return Route.KindAbfrage;
    case Route.KindAbfrage:
      if (currentRoute.payload.istGeboren) {
        return Route.GeborenesKindAngaben;
      } else {
        return Route.UngeborenesKindAngaben;
      }
    case Route.GeborenesKindAngaben:
      return Route.GeschwisterkindAbfrage;
    case Route.UngeborenesKindAngaben: {
      const { errechneterEntbindungstermin } = currentRoute.payload;
      const heuteVorZweiWochen = Temporal.Now.plainDateISO().subtract({
        days: 14,
      });

      const istGeburtWahrscheinlich =
        Temporal.PlainDateTime.compare(
          errechneterEntbindungstermin,
          heuteVorZweiWochen,
        ) < 0;

      if (istGeburtWahrscheinlich) {
        return Route.WahrscheinlichGeborenesKindAbfrage;
      } else {
        return Route.GeschwisterkindAbfrage;
      }
    }
    case Route.WahrscheinlichGeborenesKindAbfrage:
      return Route.GeschwisterkindAbfrage;
    case Route.GeschwisterkindAbfrage:
      return currentRoute.payload.istVorhanden
        ? generatePath(Route.GeschwisterkindAngaben, { index: "0" })
        : Route.ElternteilAllgemeineAngaben;
    case Route.GeschwisterkindAngaben:
      return currentRoute.payload.istWeiteresGeschwisterkindVorhanden
        ? generatePath(Route.GeschwisterkindAngaben, {
            index: (currentRoute.params.index + 1).toString(),
          })
        : Route.ElternteilAllgemeineAngaben;
    case Route.ElternteilAllgemeineAngaben:
      throw Error("Not yet implemented.");
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const { vi, beforeEach, afterEach } = import.meta.vitest;

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  describe("getNextRoute", () => {
    it("returns KindAbfrage given AllgemeineAngaben as currentRoute", () => {
      const nextRoute = getNextRoute({
        route: Route.AllgemeineAngaben,
        payload: {
          bundesland: "Berlin",
          gesamteinkommenGrenzeUeberschritten: false,
        },
      });

      expect(nextRoute).toEqual(Route.KindAbfrage);
    });

    it("returns GeborenesKindAngaben given KindAbfrage as currentRoute and istGeboren true", () => {
      const nextRoute = getNextRoute({
        route: Route.KindAbfrage,
        payload: { istGeboren: true },
      });

      expect(nextRoute).toEqual(Route.GeborenesKindAngaben);
    });

    it("returns UngeborenesKindAngaben given KindAbfrage as currentRoute and istGeboren false", () => {
      const nextRoute = getNextRoute({
        route: Route.KindAbfrage,
        payload: { istGeboren: false },
      });

      expect(nextRoute).toEqual(Route.UngeborenesKindAngaben);
    });

    it("returns GeschwisterkindAbfrage given GeborenesKindAngaben as currentRoute and required inputs", () => {
      const nextRoute = getNextRoute({
        route: Route.GeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          geburtsdatum: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.GeschwisterkindAbfrage);
    });

    it("returns GeschwisterkindAbfrage given UngeborenesKindAngaben as currentRoute and date under threshold", () => {
      const nextRoute = getNextRoute({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.GeschwisterkindAbfrage);
    });

    it("returns GeschwisterkindAbfrage given UngeborenesKindAngaben as currentRoute and date exactly at threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const nextRoute = getNextRoute({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-18"),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.GeschwisterkindAbfrage);
    });

    it("returns WahrscheinlichGeborenesKindAbfrage given UngeborenesKindAngaben as currentRoute and date before threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const nextRoute = getNextRoute({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-17"),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.WahrscheinlichGeborenesKindAbfrage);
    });

    it("returns GeschwisterkindAbfrage given WahrscheinlichGeborenesKindAbfrage as currentRoute", () => {
      const heute = Temporal.Now.plainDateISO();

      const nextRoute = getNextRoute({
        route: Route.WahrscheinlichGeborenesKindAbfrage,
        payload: {
          geburtsdatum: heute,
        },
      });

      expect(nextRoute).toEqual(Route.GeschwisterkindAbfrage);
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAbfrage as currentRoute and istVorhanden equals yes", () => {
      const nextRoute = getNextRoute({
        route: Route.GeschwisterkindAbfrage,
        payload: {
          istVorhanden: true,
        },
      });

      expect(nextRoute).toEqual("/geschwisterkind/0");
    });

    it("returns ElternteilAllgemeineAngaben given GeschwisterkindAbfrage as currentRoute and istVorhanden equals no", () => {
      const nextRoute = getNextRoute({
        route: Route.GeschwisterkindAbfrage,
        payload: {
          istVorhanden: false,
        },
      });

      expect(nextRoute).toEqual(Route.ElternteilAllgemeineAngaben);
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute and istWeiteresGeschwisterkindVorhanden equals yes", () => {
      const nextRoute = getNextRoute({
        route: Route.GeschwisterkindAngaben,
        params: { index: 0 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
      });

      expect(nextRoute).toEqual("/geschwisterkind/1");
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute and istWeiteresGeschwisterkindVorhanden equals yes", () => {
      const nextRoute = getNextRoute({
        route: Route.GeschwisterkindAngaben,
        params: { index: 1 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
      });

      expect(nextRoute).toEqual("/geschwisterkind/2");
    });

    it("returns ElternteilAllgemeineAngaben given GeschwisterkindAngaben as currentRoute and istWeiteresGeschwisterkindVorhanden equals no", () => {
      const nextRoute = getNextRoute({
        route: Route.GeschwisterkindAngaben,
        params: { index: 0 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      });

      expect(nextRoute).toEqual(Route.ElternteilAllgemeineAngaben);
    });
  });
}
