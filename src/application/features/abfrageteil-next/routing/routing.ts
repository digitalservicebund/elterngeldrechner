import { Temporal } from "@js-temporal/polyfill";
import { generatePath } from "react-router";
import { Route } from "./Route";
import { AllgemeineAngaben } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngabenSchema";
import { ElternteilAllgemeineAngaben } from "@/application/features/abfrageteil-next/elternteil/ElternteilSchema";
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
      params: { index: 0 | 1 };
      payload: ElternteilAllgemeineAngaben;
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

export function generateAbfrageteilPath(subpath: string): string {
  return `/abfrageteil${subpath}`;
}

export function generatePathFromEvent(event: FormEvent) {
  return generateAbfrageteilPath(
    generatePath(
      event.route.toString(),
      "params" in event ? paramsToStrings(event.params) : undefined,
    ),
  );
}

function getNextSubpath(event: FormEvent): string {
  switch (event.route) {
    case Route.Startseite:
      return Route.AllgemeineAngaben;
    case Route.AllgemeineAngaben:
      return Route.KindAbfrage;
    case Route.KindAbfrage:
      return event.payload.istGeboren
        ? Route.GeborenesKindAngaben
        : Route.UngeborenesKindAngaben;
    case Route.GeborenesKindAngaben:
      return Route.GeschwisterkindAbfrage;
    case Route.UngeborenesKindAngaben: {
      const { errechneterEntbindungstermin } = event.payload;
      const heuteVorZweiWochen = Temporal.Now.plainDateISO().subtract({
        days: 14,
      });

      const istGeburtWahrscheinlich =
        Temporal.PlainDateTime.compare(
          errechneterEntbindungstermin,
          heuteVorZweiWochen,
        ) < 0;

      return istGeburtWahrscheinlich
        ? Route.WahrscheinlichGeborenesKindAbfrage
        : Route.GeschwisterkindAbfrage;
    }
    case Route.WahrscheinlichGeborenesKindAbfrage:
      return Route.GeschwisterkindAbfrage;
    case Route.GeschwisterkindAbfrage:
      return event.payload.istVorhanden
        ? generatePath(Route.GeschwisterkindAngaben, { index: "0" })
        : Route.ElternteilAllgemeineAngaben;
    case Route.GeschwisterkindAngaben:
      return event.payload.istWeiteresGeschwisterkindVorhanden
        ? generatePath(Route.GeschwisterkindAngaben, {
            index: (event.params.index + 1).toString(),
          })
        : Route.ElternteilAllgemeineAngaben;
    case Route.ElternteilAllgemeineAngaben:
      throw Error("Not yet implemented.");
  }
}

export function findeNaechstenPfad(event: FormEvent): string {
  return generateAbfrageteilPath(getNextSubpath(event));
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const { vi, beforeEach, afterEach } = import.meta.vitest;

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  describe("findeNaechstenPfad", () => {
    it("returns KindAbfrage given AllgemeineAngaben as currentRoute", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.AllgemeineAngaben,
        payload: {
          bundesland: "Berlin",
          gesamteinkommenGrenzeUeberschritten: false,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/kind");
    });

    it("returns GeborenesKindAngaben given KindAbfrage as currentRoute and istGeboren true", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.KindAbfrage,
        payload: { istGeboren: true },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/kind/geboren");
    });

    it("returns UngeborenesKindAngaben given KindAbfrage as currentRoute and istGeboren false", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.KindAbfrage,
        payload: { istGeboren: false },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/kind/ungeboren");
    });

    it("returns GeschwisterkindAbfrage given GeborenesKindAngaben as currentRoute and required inputs", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          geburtsdatum: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind");
    });

    it("returns GeschwisterkindAbfrage given UngeborenesKindAngaben as currentRoute and date under threshold", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.Now.plainDateISO(),
          anzahl: 1,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind");
    });

    it("returns GeschwisterkindAbfrage given UngeborenesKindAngaben as currentRoute and date exactly at threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const naechsterPfad = findeNaechstenPfad({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-18"),
          anzahl: 1,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind");
    });

    it("returns WahrscheinlichGeborenesKindAbfrage given UngeborenesKindAngaben as currentRoute and date before threshold", () => {
      vi.setSystemTime(new Date("2024-02-01T12:00:00Z"));

      const naechsterPfad = findeNaechstenPfad({
        route: Route.UngeborenesKindAngaben,
        payload: {
          errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-17"),
          anzahl: 1,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/kind/ungeboren/validierung");
    });

    it("returns GeschwisterkindAbfrage given WahrscheinlichGeborenesKindAbfrage as currentRoute", () => {
      const heute = Temporal.Now.plainDateISO();

      const naechsterPfad = findeNaechstenPfad({
        route: Route.WahrscheinlichGeborenesKindAbfrage,
        payload: {
          geburtsdatum: heute,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind");
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAbfrage as currentRoute and istVorhanden equals yes", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAbfrage,
        payload: {
          istVorhanden: true,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/0");
    });

    it("returns ElternteilAllgemeineAngaben given GeschwisterkindAbfrage as currentRoute and istVorhanden equals no", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAbfrage,
        payload: {
          istVorhanden: false,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/elternteil/:index");
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals zero and istWeiteresGeschwisterkindVorhanden equals yes", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAngaben,
        params: { index: 0 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/1");
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals one and istWeiteresGeschwisterkindVorhanden equals yes", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAngaben,
        params: { index: 1 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: true,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/2");
    });

    it("returns ElternteilAllgemeineAngaben given GeschwisterkindAngaben as currentRoute and istWeiteresGeschwisterkindVorhanden equals no", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAngaben,
        params: { index: 0 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/elternteil/:index");
    });
  });
}
