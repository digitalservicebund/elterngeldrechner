import { Temporal } from "@js-temporal/polyfill";
import { Navigate, RouterProvider, createHashRouter } from "react-router";
import { AllgemeineAngabenPage } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngaben.page";
import { GeborenesKindPage } from "@/application/features/abfrageteil-next/kind/GeborenesKind.page";
import { KindPage } from "@/application/features/abfrageteil-next/kind/Kind.page";
import {
  GeborenesKind,
  Geburt,
  UngeborenesKind,
} from "@/application/features/abfrageteil-next/kind/Kind.schema";
import { Startseite } from "@/application/features/abfrageteil-next/startseite/Startseite.page";

enum Route {
  Startseite,
  Allgemein,
  Kind,
  GeborenesKind,
  Geschwister,
  UngeborenesKind,
  WahrscheinlichGeborenesKind,
}
type Event =
  | { route: Route.Startseite }
  | { route: Route.Allgemein }
  | { route: Route.Kind; payload: Geburt }
  | { route: Route.GeborenesKind; payload: GeborenesKind }
  | { route: Route.UngeborenesKind; payload: UngeborenesKind }
  | { route: Route.WahrscheinlichGeborenesKind; payload: GeborenesKind };

export function getNextRoute(currentRoute: Event): Route {
  switch (currentRoute.route) {
    case Route.Startseite:
      return Route.Allgemein;
    case Route.Allgemein:
      return Route.Kind;
    case Route.Kind:
      if (currentRoute.payload.istGeboren) {
        return Route.GeborenesKind;
      } else {
        return Route.UngeborenesKind;
      }
    case Route.GeborenesKind:
      return Route.Geschwister;
    case Route.UngeborenesKind: {
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
        return Route.WahrscheinlichGeborenesKind;
      } else {
        return Route.Geschwister;
      }
    }
    case Route.WahrscheinlichGeborenesKind:
      return Route.Geschwister;
  }
}

if (import.meta.vitest) {
  const { describe, it, expect, vi, beforeEach, afterEach } = import.meta
    .vitest;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getNextRoute", () => {
    it("returns Allgemein given Startseite as currentRoute", () => {
      const nextRoute = getNextRoute({ route: Route.Startseite });

      expect(nextRoute).toEqual(Route.Allgemein);
    });

    it("returns Kind given Allgemein as currentRoute", () => {
      const nextRoute = getNextRoute({ route: Route.Allgemein });

      expect(nextRoute).toEqual(Route.Kind);
    });

    it("returns GeborenesKind given Kind as currentRoute and istGeboren true", () => {
      const nextRoute = getNextRoute({
        route: Route.Kind,
        payload: { istGeboren: true },
      });

      expect(nextRoute).toEqual(Route.GeborenesKind);
    });

    it("returns UngeborenesKind given Kind as currentRoute and istGeboren false", () => {
      const nextRoute = getNextRoute({
        route: Route.Kind,
        payload: { istGeboren: false },
      });

      expect(nextRoute).toEqual(Route.UngeborenesKind);
    });

    it("returns Geschwister given GeborenesKind as currentRoute and required inputs", () => {
      const nextRoute = getNextRoute({
        route: Route.GeborenesKind,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          geburtsdatum: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.Geschwister);
    });

    it("returns Geschwister given UngeborenesKind as currentRoute and date under threshold", () => {
      const nextRoute = getNextRoute({
        route: Route.UngeborenesKind,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.Geschwister);
    });

    it("returns Geschwister given UngeborenesKind as currentRoute and date exactly at threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const nextRoute = getNextRoute({
        route: Route.UngeborenesKind,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-18"),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.Geschwister);
    });

    it("returns UngeborenesKindValidierung given UngeborenesKind as currentRoute and date before threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const nextRoute = getNextRoute({
        route: Route.UngeborenesKind,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-17"),
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.WahrscheinlichGeborenesKind);
    });

    it("returns Geschwister given WahrscheinlichGeborenesKind as currentRoute", () => {
      const heute = Temporal.Now.plainDateISO();
      const heuteVorMehrAlsZweiWochen = Temporal.Now.plainDateISO().subtract({
        days: 15,
      });

      const nextRoute = getNextRoute({
        route: Route.WahrscheinlichGeborenesKind,
        payload: {
          errechneterEntbindungstermin: heuteVorMehrAlsZweiWochen,
          geburtsdatum: heute,
          anzahl: 1,
        },
      });

      expect(nextRoute).toEqual(Route.Geschwister);
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
