import { Temporal } from "@js-temporal/polyfill";
import {
  Navigate,
  RouterProvider,
  createHashRouter,
  generatePath,
} from "react-router";
import { AllgemeineAngabenPage } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngaben.page";
import { GeborenesKindPage } from "@/application/features/abfrageteil-next/kind/GeborenesKind.page";
import { KindPage } from "@/application/features/abfrageteil-next/kind/Kind.page";
import {
  GeborenesKind,
  Geburt,
  UngeborenesKind,
} from "@/application/features/abfrageteil-next/kind/Kind.schema";
import { Startseite } from "@/application/features/abfrageteil-next/startseite/Startseite.page";

export type GeschwisterkindAbfrage = { istVorhanden: boolean };

export type GeschwisterkindAngaben = {
  geburtsdatum: Temporal.PlainDate;
  hatBehinderung: boolean;
  istWeiteresGeschwisterkindVorhanden: boolean;
};

export enum Route {
  Startseite = "/startseite",

  AllgemeineAngaben = "/allgemeine-angaben",

  KindAbfrage = "/kind",
  GeborenesKindAngaben = "/kind/geboren",
  UngeborenesKindAngaben = "/kind/ungeboren",
  WahrscheinlichGeborenesKindAbfrage = "/kind/ungeboren/validierung",

  GeschwisterkindAbfrage = "/geschwisterkind",
  GeschwisterkindAngaben = "/geschwisterkind/:index",

  ElternteilAllgemeineAngaben = "/elternteil/:index",
  // ElternteilAusklammerungsgruendeAngaben,
  // ElternteilAusklammerungszeitenAngaben,
  // ElternteilTaetigkeitenAngaben,
}

export type Event =
  | { route: Route.Startseite }
  | { route: Route.AllgemeineAngaben }
  | { route: Route.KindAbfrage; payload: Geburt }
  | { route: Route.GeborenesKindAngaben; payload: GeborenesKind }
  | { route: Route.UngeborenesKindAngaben; payload: UngeborenesKind }
  | { route: Route.WahrscheinlichGeborenesKindAbfrage; payload: GeborenesKind }
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

function paramsToStrings(
  params: Record<string, number>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => [key, value.toString()]),
  );
}

export function generatePathFromEvent(event: Event) {
  return generatePath(
    event.route.toString(),
    "params" in event ? paramsToStrings(event.params) : undefined,
  );
}

export function getNextRoute(currentRoute: Event): string {
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
    it("returns AllgemeineAngaben given Startseite as currentRoute", () => {
      const nextRoute = getNextRoute({ route: Route.Startseite });

      expect(nextRoute).toEqual(Route.AllgemeineAngaben);
    });

    it("returns KindAbfrage given AllgemeineAngaben as currentRoute", () => {
      const nextRoute = getNextRoute({ route: Route.AllgemeineAngaben });

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
      const heuteVorMehrAlsZweiWochen = Temporal.Now.plainDateISO().subtract({
        days: 15,
      });

      const nextRoute = getNextRoute({
        route: Route.WahrscheinlichGeborenesKindAbfrage,
        payload: {
          errechneterEntbindungstermin: heuteVorMehrAlsZweiWochen,
          geburtsdatum: heute,
          anzahl: 1,
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

export default function Router() {
  // The hash router does not support the `hashType` property
  // at this point in time. This means that the routes look
  // like this: http://localhost:3000/#/nachwuchs and also
  // that jQuery throws the following error on initial page
  // load. The root of this issue is that jQuery tries to
  // navigate to the hash part of the window.location but
  // fails to do so because of the leading slash.
  //
  // Source: commons-*.js
  // Error: Uncaught Error: Syntax error, unrecognized expression
  //
  // https://github.com/remix-run/react-router/pull/11310
  // https://v5.reactrouter.com/web/api/HashRouter/hashtype-string

  const router = createHashRouter([
    {
      element: <Startseite />,
      path: "/abfrageteil-v2/startseite",
    },
    {
      element: <AllgemeineAngabenPage />,
      path: "/abfrageteil-v2/allgemeine-angaben",
    },
    { element: <KindPage />, path: "/abfrageteil-v2/kind" },
    { element: <GeborenesKindPage />, path: "/abfrageteil-v2/kind/geboren" },
    {
      element: <Navigate to="/abfrageteil-v2/startseite" replace />,
      path: "*",
    },
  ]);
  return <RouterProvider router={router} />;
}
