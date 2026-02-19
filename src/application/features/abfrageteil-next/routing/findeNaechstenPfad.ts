import { Temporal } from "@js-temporal/polyfill";
import { FormEvent } from "./FormEvent";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { generateParametrizedPath } from "./generatePath/generateParametrizedPath";

export function findeNaechstenPfad(event: FormEvent): string {
  return generateAbfrageteilPath(getNextSubpath(event));
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
        ? generateParametrizedPath(Route.GeschwisterkindAngaben, {
            geschwisterIndex: "0",
          })
        : generateParametrizedPath(Route.ElternteilAllgemeineAngaben, {
            elternteilIndex: "0",
          });
    case Route.GeschwisterkindAngaben:
      return event.payload.istWeiteresGeschwisterkindVorhanden
        ? generateParametrizedPath(Route.GeschwisterkindAngaben, {
            geschwisterIndex: (event.params.geschwisterIndex + 1).toString(),
          })
        : generateParametrizedPath(Route.ElternteilAllgemeineAngaben, {
            elternteilIndex: "0",
          });
    case Route.ElternteilAllgemeineAngaben:
      return generateParametrizedPath(
        Route.ElternteilAusklammerungGruendeAngaben,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
        },
      );
    case Route.ElternteilAusklammerungGruendeAngaben: {
      const hatAusklammerungsgrund =
        event.payload.hatMutterschutzAelteresKind ||
        event.payload.hatElterngeldAelteresKind ||
        event.payload.hatSchwangerschaftsbedingteErkrankung;
      const zielRoute = hatAusklammerungsgrund
        ? Route.ElternteilAusklammerungZeitenAngaben
        : Route.ElternteilTaetigkeitenAbfrage;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungZeitenAngaben:
      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: event.params.elternteilIndex.toString(),
      });
    case Route.ElternteilTaetigkeitenAbfrage:
      throw Error("Not yet implemented.");
  }
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

      expect(naechsterPfad).toEqual("/abfrageteil/elternteil/0");
    });

    it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals zero and istWeiteresGeschwisterkindVorhanden equals yes", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.GeschwisterkindAngaben,
        params: { geschwisterIndex: 0 },
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
        params: { geschwisterIndex: 1 },
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
        params: { geschwisterIndex: 0 },
        payload: {
          geburtsdatum: Temporal.Now.plainDateISO(),
          hatBehinderung: false,
          istWeiteresGeschwisterkindVorhanden: false,
        },
      });

      expect(naechsterPfad).toEqual("/abfrageteil/elternteil/0");
    });

    it("returns ElternteilAusklammerungGruendeAngaben given ElternteilAllgemeineAngaben as currentRoute and index 0", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAllgemeineAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          name: "Vorname",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/0/ausklammerung-gruende",
      );
    });

    it("returns ElternteilAusklammerungGruendeAngaben given ElternteilAllgemeineAngaben as currentRoute and index 1", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAllgemeineAngaben,
        params: { elternteilIndex: 1 },
        payload: {
          name: "Vorname",
          istAlleinerziehend: false,
          istImMutterschutz: true,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/1/ausklammerung-gruende",
      );
    });

    it("returns ElternteilAusklammerungZeitenAngaben given ElternteilAusklammerungGruendeAngaben as currentRoute and index 0 and at least one ausklammerungsgrund", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          hatMutterschutzAelteresKind: true,
          hatElterngeldAelteresKind: true,
          hatSchwangerschaftsbedingteErkrankung: true,
          hatKeineAusklammerungsgruende: false,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/0/ausklammerung-zeiten",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungGruendeAngaben as currentRoute and index 0 and no ausklammerungsgrund", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          hatMutterschutzAelteresKind: false,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
          hatKeineAusklammerungsgruende: false,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/0/taetigkeiten-abfrage",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungGruendeAngaben as currentRoute and index 0 and hatKeineAusklammerungsgruende true", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 0 },
        payload: {
          hatMutterschutzAelteresKind: false,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
          hatKeineAusklammerungsgruende: true,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/0/taetigkeiten-abfrage",
      );
    });

    it("returns ElternteilAusklammerungZeitenAngaben given ElternteilAusklammerungGruendeAngaben as currentRoute and index 1", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 1 },
        payload: {
          hatMutterschutzAelteresKind: true,
          hatElterngeldAelteresKind: true,
          hatSchwangerschaftsbedingteErkrankung: true,
          hatKeineAusklammerungsgruende: false,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/1/ausklammerung-zeiten",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungGruendeAngaben as currentRoute and index 1 and no ausklammerungsgrund", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 1 },
        payload: {
          hatMutterschutzAelteresKind: false,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
          hatKeineAusklammerungsgruende: false,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/1/taetigkeiten-abfrage",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungGruendeAngaben as currentRoute and index 1 and hatKeineAusklammerungsgruende true", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungGruendeAngaben,
        params: { elternteilIndex: 1 },
        payload: {
          hatMutterschutzAelteresKind: false,
          hatElterngeldAelteresKind: false,
          hatSchwangerschaftsbedingteErkrankung: false,
          hatKeineAusklammerungsgruende: true,
        },
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/1/taetigkeiten-abfrage",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 0", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungZeitenAngaben,
        params: { elternteilIndex: 0 },
        payload: [
          {
            grund: "mutterschutz",
            von: Temporal.PlainDate.from("2025-12-23"),
            bis: Temporal.PlainDate.from("2026-02-05"),
          },
        ],
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/0/taetigkeiten-abfrage",
      );
    });

    it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 1", () => {
      const naechsterPfad = findeNaechstenPfad({
        route: Route.ElternteilAusklammerungZeitenAngaben,
        params: { elternteilIndex: 1 },
        payload: [
          {
            grund: "mutterschutz",
            von: Temporal.PlainDate.from("2025-12-23"),
            bis: Temporal.PlainDate.from("2026-02-05"),
          },
        ],
      });

      expect(naechsterPfad).toEqual(
        "/abfrageteil/elternteil/1/taetigkeiten-abfrage",
      );
    });
  });
}
