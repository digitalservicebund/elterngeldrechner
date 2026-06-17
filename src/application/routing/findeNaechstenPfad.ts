import { Temporal } from "@js-temporal/polyfill";
import { FormEvent } from "./FormEvent";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { generateParametrizedPath } from "./generatePath/generateParametrizedPath";
import { Steuerklasse } from "@/elterngeldrechner";

export function findeNaechstenPfad(event: FormEvent): string {
  const subpath = getNextSubpath(event);
  return subpath === "DONE" ? "/beispiele" : generateAbfrageteilPath(subpath);
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
      const heuteVorZweiWochenPlusZweiTagen =
        Temporal.Now.plainDateISO().subtract({
          days: 16,
        });

      const istGeburtWahrscheinlich =
        Temporal.PlainDateTime.compare(
          errechneterEntbindungstermin,
          heuteVorZweiWochenPlusZweiTagen,
        ) < 0;

      return istGeburtWahrscheinlich
        ? Route.WahrscheinlichGeborenesKindAbfrage
        : Route.GeschwisterkindAbfrage;
    }
    case Route.WahrscheinlichGeborenesKindAbfrage:
      return Route.GeschwisterkindAbfrage;
    case Route.GeschwisterkindAbfrage:
      return event.payload.istVorhanden
        ? Route.GeschwisterkindAnzahlAbfrage
        : Route.ElternteilEinsAllgemeineAngaben;
    case Route.GeschwisterkindAnzahlAbfrage:
      return generateParametrizedPath(Route.GeschwisterkindAngaben, {
        geschwisterIndex: "0",
      });
    case Route.GeschwisterkindAngaben:
      return event.dependentValues.anzahlGeschwister >
        event.params.geschwisterIndex + 1
        ? generateParametrizedPath(Route.GeschwisterkindAngaben, {
            geschwisterIndex: (event.params.geschwisterIndex + 1).toString(),
          })
        : Route.GeschwisterbonusUebersicht;
    case Route.GeschwisterbonusUebersicht:
      return Route.ElternteilEinsAllgemeineAngaben;
    case Route.ElternteilEinsAllgemeineAngaben: {
      const zielRoute = event.payload.istAlleinerziehend
        ? Route.ElternteilAusklammerungGruendeAngaben
        : Route.ElternteilGemeinsamePlanungAbfrage;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: "0",
      });
    }
    case Route.ElternteilGemeinsamePlanungAbfrage:
      return generateParametrizedPath(
        Route.ElternteilAusklammerungGruendeAngaben,
        {
          elternteilIndex: "0",
        },
      );
    case Route.ElternteilAusklammerungGruendeAngaben: {
      const { payload } = event;
      const hatAusklammerungsgrund =
        payload.hatMutterschutzAelteresKind ||
        payload.hatElterngeldAelteresKind ||
        payload.hatSchwangerschaftsbedingteErkrankung;
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
      return generateParametrizedPath(
        Route.ElternteilTaetigkeitenBMZUebersicht,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
        },
      );
    case Route.ElternteilTaetigkeitenBMZUebersicht: {
      const { params, dependentValues } = event;
      const taetigkeiten = dependentValues.taetigkeiten;

      const hatErwerbstaetigkeit =
        taetigkeiten.istNichtSelbststaendig ||
        taetigkeiten.istSelbststaendig ||
        taetigkeiten.istVerbeamtet;

      if (!hatErwerbstaetigkeit) {
        return event.params.elternteilIndex === 1 ||
          dependentValues.istPersonAlleinerziehend
          ? "DONE"
          : Route.ElternteilZweiAllgemeineAngaben;
      }

      const zielRoute =
        taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet
          ? Route.ElternteilTaetigkeitAngabenNichtSelbststaendig
          : Route.ElternteilTaetigkeitAngabenSelbststaendig;

      return generateParametrizedPath(zielRoute, {
        elternteilIndex: params.elternteilIndex.toString(),
        taetigkeitIndex: "0",
      });
    }
    case Route.ElternteilTaetigkeitAngabenSelbststaendig:
      return generateParametrizedPath(
        Route.ElternteilWeitereTaetigkeitAbfrage,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
          taetigkeitIndex: event.params.taetigkeitIndex.toString(),
        },
      );
    case Route.ElternteilTaetigkeitAngabenNichtSelbststaendig: {
      const { payload, dependentValues, params } = event;

      const zielRoute = !payload.istTaetigkeitMinijob
        ? Route.ElternteilTaetigkeitAngabenSozialversicherungen
        : !dependentValues.kannDurchschnittAngegebenWerden
          ? Route.ElternteilTaetigkeitAngabenEinkommenDetails
          : Route.ElternteilTaetigkeitAngabenMinijob;

      return generateParametrizedPath(zielRoute, {
        elternteilIndex: params.elternteilIndex.toString(),
        taetigkeitIndex: params.taetigkeitIndex.toString(),
      });
    }
    case Route.ElternteilTaetigkeitAngabenMinijob:
    case Route.ElternteilTaetigkeitAngabenSozialversicherungen: {
      const zielRoute = event.payload.istEinkommenGleichVerteilt
        ? Route.ElternteilTaetigkeitAngabenEinkommen
        : Route.ElternteilTaetigkeitAngabenEinkommenDetails;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
        taetigkeitIndex: event.params.taetigkeitIndex.toString(),
      });
    }
    case Route.ElternteilTaetigkeitAngabenEinkommen:
    case Route.ElternteilTaetigkeitAngabenEinkommenDetails: {
      const {
        params: { taetigkeitIndex, elternteilIndex },
        dependentValues: { istMischeinkunft },
      } = event;

      if (istMischeinkunft && taetigkeitIndex === 0) {
        return generateParametrizedPath(
          Route.ElternteilTaetigkeitAngabenSelbststaendig,
          {
            elternteilIndex: elternteilIndex.toString(),
            taetigkeitIndex: (taetigkeitIndex + 1).toString(),
          },
        );
      } else {
        return generateParametrizedPath(
          Route.ElternteilWeitereTaetigkeitAbfrage,
          {
            elternteilIndex: elternteilIndex.toString(),
            taetigkeitIndex: taetigkeitIndex.toString(),
          },
        );
      }
    }
    case Route.ElternteilWeitereTaetigkeitAbfrage: {
      const { payload, dependentValues } = event;
      if (!payload.istWeitereTaetigkeitVorhanden) {
        return !dependentValues.wirdZweitePersonBeruecksichtigt ||
          event.params.elternteilIndex === 1
          ? "DONE"
          : Route.ElternteilZweiAllgemeineAngaben;
      }
      const zielRoute = dependentValues.istSelbststaendigeTaetigkeitMoeglich
        ? Route.ElternteilWeitereTaetigkeitAngaben
        : Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
      const taetigkeitIndex =
        dependentValues.istSelbststaendigeTaetigkeitMoeglich
          ? event.params.taetigkeitIndex
          : event.params.taetigkeitIndex + 1;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
        taetigkeitIndex: taetigkeitIndex.toString(),
      });
    }
    case Route.ElternteilWeitereTaetigkeitAngaben: {
      const { istWeitereTaetigkeitSelbststaendigeTaetigkeit } = event.payload;
      const zielRoute = istWeitereTaetigkeitSelbststaendigeTaetigkeit
        ? Route.ElternteilTaetigkeitAngabenSelbststaendig
        : Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
        taetigkeitIndex: (event.params.taetigkeitIndex + 1).toString(),
      });
    }
    case Route.ElternteilZweiAllgemeineAngaben: {
      if (event.dependentValues.hatPotenzielleAusklammerungen) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungGruendeAngaben,
          {
            elternteilIndex: "1",
          },
        );
      }

      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: "1",
      });
    }
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const { vi, beforeEach, afterEach } = import.meta.vitest;

  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  describe("findeNaechstenPfad", () => {
    describe("AllgemeineAngaben", () => {
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
    });

    describe("KindAbfrage", () => {
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
    });

    describe("GeborenesKindAngaben", () => {
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
    });

    describe("UngeborenesKindAngaben", () => {
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
            errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-15"),
            anzahl: 1,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/kind/ungeboren/validierung",
        );
      });
    });

    describe("WahrscheinlichGeborenesKindAbfrage", () => {
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
    });

    describe("GeschwisterkindAbfrage", () => {
      it("returns GeschwisterkindAnzahlAbfrage given GeschwisterkindAbfrage as currentRoute and istVorhanden equals yes", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAbfrage,
          payload: {
            istVorhanden: true,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/anzahl");
      });

      it("returns ElternteilEinsAllgemeineAngaben given GeschwisterkindAbfrage as currentRoute and istVorhanden equals no", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAbfrage,
          payload: {
            istVorhanden: false,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/0");
      });
    });

    describe("GeschwisterkindAnzahlAbfrage", () => {
      it("returns GeschwisterkindAngaben given GeschwisterkindAnzahlAbfrage as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAnzahlAbfrage,
          payload: {
            anzahlGeschwister: 1,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/0");
      });
    });

    describe("GeschwisterkindAngaben", () => {
      it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals zero and anzahlGeschwister is 2", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwister: 2,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/1");
      });

      it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals one and anzahlGeschwister is 3", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 1 },
          payload: {
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwister: 3,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/2");
      });

      it("returns GeschwisterbonusUebersicht given GeschwisterkindAngaben as currentRoute, index equals zero and anzahlGeschwister is 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterIndex: 0 },
          payload: {
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwister: 1,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/bonus");
      });
    });

    describe("GeschwisterbonusUebersicht", () => {
      it("returns ElternteilEinsAllgemeineAngaben given GeschwisterbonusUebersicht as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterbonusUebersicht,
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/0");
      });
    });

    describe("ElternteilEinsAllgemeineAngaben", () => {
      it("returns ElternteilAusklammerungGruendeAngaben given ElternteilEinsAllgemeineAngaben as currentRoute and istAlleinerziehend true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Vorname",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/gruende",
        );
      });

      it("returns ElternteilGemeinsamePlanungAbfrage given ElternteilEinsAllgemeineAngaben as currentRoute and istAlleinerziehend false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Vorname",
            istAlleinerziehend: false,
            istImMutterschutz: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/planung-abfrage",
        );
      });
    });

    describe("ElternteilGemeinsamePlanungAbfrage", () => {
      it("returns ElternteilAusklammerungGruendeAngaben given ElternteilGemeinsamePlanungAbfrage as currentRoute and index 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/gruende",
        );
      });
    });

    describe("ElternteilAusklammerungGruendeAngaben", () => {
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
          "/abfrageteil/elternteil/0/ausklammerung/zeiten",
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
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
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
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
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
          "/abfrageteil/elternteil/1/ausklammerung/zeiten",
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
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/abfrage",
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
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungZeitenAngaben", () => {
      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutzGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 1 },
          payload: {
            mutterschutzGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
            elterngeldGeschwisterkind: [],
            erkrankungSchwangerschaft: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilTaetigkeitenAbfrage", () => {
      it("returns ElternteilTaetigkeitenBMZUebersicht given ElternteilTaetigkeitenAbfrage as currentRoute and elternteilIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/bmz",
        );
      });

      it("returns ElternteilTaetigkeitenBMZUebersicht given ElternteilTaetigkeitenAbfrage as currentRoute and elternteilIndex 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 1 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/bmz",
        );
      });
    });

    describe("ElternteilTaetigkeitenBMZUebersicht", () => {
      it("returns ElternteilZweiAllgemeineAngaben given ElternteilTaetigkeitenBMZUebersicht as currentRoute and hatKeinEinkommen true and elternteilIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/1");
      });

      it("returns ElternteilZweiAllgemeineAngaben given ElternteilTaetigkeitenBMZUebersicht as currentRoute and only hatAndereLeistungen true and elternteilIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: true,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/1");
      });

      it("returns BeispielePage given ElternteilTaetigkeitenBMZUebersicht as currentRoute and hatKeinEinkommen true and elternteilIndex 0 and istPersonAlleinerziehend true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: true,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns path for BeispielePage given ElternteilTaetigkeitenBMZUebersicht as currentRoute and hatKeinEinkommen true and elternteilIndex 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 1 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns path for BeispielePage given ElternteilTaetigkeitenBMZUebersicht as currentRoute and only hatAndereLeistungen true and elternteilIndex 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 1 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: true,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns ElternteilTaetigkeitAngabenSelbststaendig given ElternteilTaetigkeitenBMZUebersicht as currentRoute and only istSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilTaetigkeitenBMZUebersicht as currentRoute and both istSelbststaendig and istNichtSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: true,
              istSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilTaetigkeitenBMZUebersicht as currentRoute, istSelbststaendig false and istNichtSelbststaendig true even when istPersonAlleinerziehend true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: true,
            taetigkeiten: {
              istNichtSelbststaendig: true,
              istSelbststaendig: false,
              istVerbeamtet: true,
              hatAndereLeistungen: true,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilTaetigkeitenBMZUebersicht as currentRoute and only istNichtSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: true,
              istSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilTaetigkeitenBMZUebersicht as currentRoute, istSelbststaendig and istNichtSelbststaendig false and only istVerbeamtet true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenBMZUebersicht,
          params: { elternteilIndex: 0 },
          dependentValues: {
            istPersonAlleinerziehend: false,
            taetigkeiten: {
              istNichtSelbststaendig: false,
              istSelbststaendig: false,
              istVerbeamtet: true,
              hatAndereLeistungen: false,
              hatPeriodenOhneEinkommen: false,
            },
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenSelbststaendig", () => {
      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenSelbststaendig as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istKirchensteuerpflichtig: true,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            bruttoJahresgewinn: 10000,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenNichtSelbststaendig", () => {
      it("returns ElternteilTaetigkeitAngabenMinijob given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute, istTaetigkeitMinijob true and kannDurchschnittAngegebenWerden true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: true,
          },
          dependentValues: {
            kannDurchschnittAngegebenWerden: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/minijob",
        );
      });

      it("returns ElternteilTaetigkeitAngabenEinkommenDetails given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute, istTaetigkeitMinijob true and kannDurchschnittAngegebenWerden false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: true,
          },
          dependentValues: {
            kannDurchschnittAngegebenWerden: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/einkommen/detailliert",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSozialversicherungen given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute, istTaetigkeitMinijob false and kannDurchschnittAngegebenWerden true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: false,
          },
          dependentValues: {
            kannDurchschnittAngegebenWerden: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/sozialversicherungen",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSozialversicherungen given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute, istTaetigkeitMinijob false and kannDurchschnittAngegebenWerden false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: false,
          },
          dependentValues: {
            kannDurchschnittAngegebenWerden: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/sozialversicherungen",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenMinijob", () => {
      it("returns ElternteilTaetigkeitAngabenEinkommen given ElternteilTaetigkeitAngabenMinijob as currentRoute and istEinkommenGleichVerteilt true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenMinijob,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istEinkommenGleichVerteilt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/einkommen",
        );
      });

      it("returns ElternteilTaetigkeitAngabenEinkommenDetails given ElternteilTaetigkeitAngabenMinijob as currentRoute and istEinkommenGleichVerteilt false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenMinijob,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istEinkommenGleichVerteilt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/einkommen/detailliert",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenSozialversicherungen", () => {
      it("returns ElternteilTaetigkeitAngabenEinkommen given ElternteilTaetigkeitAngabenSozialversicherungen as currentRoute and istEinkommenGleichVerteilt true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            steuerklasse: Steuerklasse.I,
            istKirchensteuerpflichtig: true,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            istEinkommenGleichVerteilt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/einkommen",
        );
      });

      it("returns ElternteilTaetigkeitAngabenEinkommenDetails given ElternteilTaetigkeitAngabenSozialversicherungen as currentRoute and istEinkommenGleichVerteilt false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            steuerklasse: Steuerklasse.I,
            istKirchensteuerpflichtig: true,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            istEinkommenGleichVerteilt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/nicht-selbststaendig/einkommen/detailliert",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenEinkommen", () => {
      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommen as currentRoute and istMischeinkunft false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            durchschnittlichesMonatsbrutto: 1000,
          },
          dependentValues: { istMischeinkunft: false },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/weitere-taetigkeit",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSelbststaendig given ElternteilTaetigkeitAngabenEinkommen as currentRoute, istMischeinkunft true and taetigkeitIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            durchschnittlichesMonatsbrutto: 1000,
          },
          dependentValues: { istMischeinkunft: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/selbststaendig",
        );
      });

      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommen as currentRoute, istMischeinkunft true and taetigkeitIndex 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 1 },
          payload: {
            durchschnittlichesMonatsbrutto: 1000,
          },
          dependentValues: { istMischeinkunft: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenEinkommenDetails", () => {
      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommenDetails as currentRoute and istMischeinkunft false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            monatsbrutto: [],
          },
          dependentValues: { istMischeinkunft: false },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/weitere-taetigkeit",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSelbststaendig given ElternteilTaetigkeitAngabenEinkommenDetails as currentRoute, istMischeinkunft true and taetigkeitIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            monatsbrutto: [],
          },
          dependentValues: { istMischeinkunft: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/selbststaendig",
        );
      });

      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommenDetails as currentRoute, istMischeinkunft true and taetigkeitIndex 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
          params: { elternteilIndex: 0, taetigkeitIndex: 1 },
          payload: {
            monatsbrutto: [],
          },
          dependentValues: { istMischeinkunft: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilWeitereTaetigkeitAbfrage", () => {
      it("returns ElternteilZweiAllgemeineAngaben given ElternteilWeitereTaetigkeitAbfrage as currentRoute, istWeitereTaetigkeitVorhanden false and wirdZweitePersonBeruecksichtigt true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: true,
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/1");
      });

      it("returns ElternteilWeitereTaetigkeitAngaben given ElternteilWeitereTaetigkeitAbfrage as currentRoute and both istWeitereTaetigkeitVorhanden and istSelbststaendigeTaetigkeitMoeglich true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: true,
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/weitere-taetigkeit-angaben",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilWeitereTaetigkeitAbfrage as currentRoute, istWeitereTaetigkeitVorhanden true and istSelbststaendigeTaetigkeitMoeglich false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: false,
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/nicht-selbststaendig",
        );
      });

      it("returns ElternteilWeitereTaetigkeitAngaben given ElternteilWeitereTaetigkeitAbfrage as currentRoute, istWeitereTaetigkeitVorhanden true, istSelbststaendigeTaetigkeitMoeglich true and wirdZweitePersonBeruecksichtigt false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: true,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/0/weitere-taetigkeit-angaben",
        );
      });

      it("returns /beispiele given ElternteilWeitereTaetigkeitAbfrage as currentRoute, istWeitereTaetigkeitVorhanden false and wirdZweitePersonBeruecksichtigt false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns /beispiele given ElternteilWeitereTaetigkeitAbfrage as currentRoute, elternteilIndex 1 and istWeitereTaetigkeitVorhanden false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 1, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            istSelbststaendigeTaetigkeitMoeglich: false,
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });
    });

    describe("ElternteilWeitereTaetigkeitAngaben", () => {
      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilWeitereTaetigkeitAngaben as currentRoute and istWeitereTaetigkeitSelbststaendigeTaetigkeit false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAngaben,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitSelbststaendigeTaetigkeit: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/nicht-selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSelbststaendig given ElternteilWeitereTaetigkeitAngaben as currentRoute and istWeitereTaetigkeitSelbststaendigeTaetigkeit true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAngaben,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitSelbststaendigeTaetigkeit: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/1/selbststaendig",
        );
      });
    });

    describe("ElternteilZweiAllgemeineAngaben", () => {
      it("returns ElternteilAusklammerungGruendeAngaben and elternteilIndex 1 given ElternteilZweiAllgemeineAngaben as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung/gruende",
        );
      });

      it("returns ElternteilAusklammerungGruendeAngaben and elternteilIndex 1 given ElternteilZweiAllgemeineAngaben as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: { hatPotenzielleAusklammerungen: true },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung/gruende",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage for elternteilIndex 1 given hatAusklammerungsgruendeMoeglichkeiten false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: { hatPotenzielleAusklammerungen: false },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/abfrage",
        );
      });
    });
  });
}
