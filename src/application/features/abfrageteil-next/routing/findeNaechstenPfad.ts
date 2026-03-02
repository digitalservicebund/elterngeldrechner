import { Temporal } from "@js-temporal/polyfill";
import { FormEvent } from "./FormEvent";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { generateParametrizedPath } from "./generatePath/generateParametrizedPath";
import { Steuerklasse } from "@/elterngeldrechner";

export function findeNaechstenPfad(event: FormEvent): string {
  const subpath = getNextSubpath(event);
  return subpath === "/beispiele"
    ? "/beispiele"
    : generateAbfrageteilPath(subpath);
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
      const { payload } = event;
      const hatAusklammerungsgrund =
        !payload.hatKeineAusklammerungsgruende &&
        (payload.hatMutterschutzAelteresKind ||
          payload.hatElterngeldAelteresKind ||
          payload.hatSchwangerschaftsbedingteErkrankung);
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
    case Route.ElternteilTaetigkeitenAbfrage: {
      const { payload } = event;
      if (payload.hatKeinEinkommen) {
        return Route.ElternteilZweitePersonAngaben;
      }
      const getZielRoute = (payload: {
        istSelbststaendig: boolean;
        istNichtSelbststaendig: boolean;
      }) => {
        if (payload.istSelbststaendig && payload.istNichtSelbststaendig) {
          return Route.ElternteilTaetigkeitAngabenMischeinkunft;
        }

        if (payload.istSelbststaendig) {
          return Route.ElternteilTaetigkeitAngabenSelbststaendig;
        }

        return Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
      };
      const zielRoute = getZielRoute(payload);
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
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
    case Route.ElternteilTaetigkeitAngabenMischeinkunft:
      return generateParametrizedPath(
        Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
          taetigkeitIndex: (event.params.taetigkeitIndex + 1).toString(),
        },
      );
    case Route.ElternteilTaetigkeitAngabenNichtSelbststaendig: {
      const zielRoute = event.payload.istTaetigkeitMinijob
        ? Route.ElternteilTaetigkeitAngabenMinijob
        : Route.ElternteilTaetigkeitAngabenSozialversicherungen;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: event.params.elternteilIndex.toString(),
        taetigkeitIndex: event.params.taetigkeitIndex.toString(),
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
    case Route.ElternteilTaetigkeitAngabenEinkommenDetails:
      return generateParametrizedPath(
        Route.ElternteilWeitereTaetigkeitAbfrage,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
          taetigkeitIndex: event.params.taetigkeitIndex.toString(),
        },
      );
    case Route.ElternteilWeitereTaetigkeitAbfrage: {
      const {
        istWeitereTaetigkeitVorhanden,
        istSelbststaendigeTaetigkeitMoeglich,
      } = event.payload;
      if (!istWeitereTaetigkeitVorhanden) {
        return Route.ElternteilZweitePersonAngaben;
      }
      const zielRoute = istSelbststaendigeTaetigkeitMoeglich
        ? Route.ElternteilWeitereTaetigkeitAngaben
        : Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
      const taetigkeitIndex = istSelbststaendigeTaetigkeitMoeglich
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
    case Route.ElternteilZweitePersonAngaben: {
      const { wirdZweitePersonBeruecksichtigt } = event.payload;
      if (wirdZweitePersonBeruecksichtigt === false) {
        return "/beispiele";
      }
      return generateParametrizedPath(
        Route.ElternteilAusklammerungGruendeAngaben,
        {
          elternteilIndex: "1",
        },
      );
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
    });

    describe("GeschwisterkindAngaben", () => {
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
    });

    describe("ElternteilAllgemeineAngaben", () => {
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
            hatKeineAusklammerungsgruende: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/taetigkeiten-abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungZeitenAngaben", () => {
      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeiten-abfrage",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungZeitenAngaben as currentRoute and index 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungZeitenAngaben,
          params: { elternteilIndex: 1 },
          payload: {
            mutterschutz: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
            elterngeld: [],
            erkrankung: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/taetigkeiten-abfrage",
        );
      });
    });

    describe("ElternteilTaetigkeitenAbfrage", () => {
      it("returns ElternteilZweitePersonAngaben given ElternteilTaetigkeitenAbfrage as currentRoute and hatKeinEinkommen true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatKeinEinkommen: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/abfrage-zweite-person",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSelbststaendig given ElternteilTaetigkeitenAbfrage as currentRoute and only istSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatKeinEinkommen: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/selbststaendig",
        );
      });

      it("returns ElternteilTaetigkeitAngabenMischeinkunft given ElternteilTaetigkeitenAbfrage as currentRoute and both istSelbststaendig and istNichtSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: true,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatKeinEinkommen: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/mischeinkunft",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilTaetigkeitenAbfrage as currentRoute, istSelbststaendig false and istNichtSelbststaendig true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: true,
            hatAndereLeistungen: true,
            hatKeinEinkommen: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig",
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
          "/abfrageteil/elternteil/0/taetigkeit/0/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenMischeinkunft", () => {
      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig with taetigkeitIndex plus 1 given ElternteilTaetigkeitAngabenMischeinkunft as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenMischeinkunft,
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
          "/abfrageteil/elternteil/0/taetigkeit/1/nicht-selbststaendig",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenNichtSelbststaendig", () => {
      it("returns ElternteilTaetigkeitAngabenMinijob given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute and istTaetigkeitMinijob true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/minijob",
        );
      });

      it("returns ElternteilTaetigkeitAngabenSozialversicherungen given ElternteilTaetigkeitAngabenNichtSelbststaendig as currentRoute and istTaetigkeitMinijob false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istTaetigkeitMinijob: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/sozialversicherungen",
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
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/einkommen",
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
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/einkommen/detailliert",
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
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/einkommen",
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
          "/abfrageteil/elternteil/0/taetigkeit/0/nicht-selbststaendig/einkommen/detailliert",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenEinkommen", () => {
      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommen as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommen,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            monatsbrutto: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilTaetigkeitAngabenEinkommenDetails", () => {
      it("returns ElternteilWeitereTaetigkeitAbfrage given ElternteilTaetigkeitAngabenEinkommenDetails as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            monatsbrutto: [],
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/weitere-taetigkeit",
        );
      });
    });

    describe("ElternteilWeitereTaetigkeitAbfrage", () => {
      it("returns ElternteilZweitePersonAngaben given ElternteilWeitereTaetigkeitAbfrage as currentRoute and istWeitereTaetigkeitVorhanden false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
            istSelbststaendigeTaetigkeitMoeglich: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/abfrage-zweite-person",
        );
      });

      it("returns ElternteilWeitereTaetigkeitAngaben given ElternteilWeitereTaetigkeitAbfrage as currentRoute and both istWeitereTaetigkeitVorhanden and istSelbststaendigeTaetigkeitMoeglich true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
            istSelbststaendigeTaetigkeitMoeglich: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/0/weitere-taetigkeit-angaben",
        );
      });

      it("returns ElternteilTaetigkeitAngabenNichtSelbststaendig given ElternteilWeitereTaetigkeitAbfrage as currentRoute, istWeitereTaetigkeitVorhanden true and istSelbststaendigeTaetigkeitMoeglich false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilWeitereTaetigkeitAbfrage,
          params: { elternteilIndex: 0, taetigkeitIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
            istSelbststaendigeTaetigkeitMoeglich: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/taetigkeit/1/nicht-selbststaendig",
        );
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
          "/abfrageteil/elternteil/0/taetigkeit/1/nicht-selbststaendig",
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
          "/abfrageteil/elternteil/0/taetigkeit/1/selbststaendig",
        );
      });
    });

    describe("ElternteilZweitePersonAngaben", () => {
      it("returns ElternteilAusklammerungGruendeAngaben and elternteilIndex 1 given ElternteilZweitePersonAngaben as currentRoute and wirdZweitePersonBeruecksichtigt yes", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweitePersonAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
            name: "Person 2",
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung-gruende",
        );
      });

      it("returns ElternteilAusklammerungGruendeAngaben and elternteilIndex 1 given ElternteilZweitePersonAngaben as currentRoute and wirdZweitePersonBeruecksichtigt unknown", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweitePersonAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: undefined,
            name: "Person 2",
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung-gruende",
        );
      });

      it("returns path for BeispielePage given ElternteilZweitePersonAngaben as currentRoute and wirdZweitePersonBeruecksichtigt no", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweitePersonAngaben,
          payload: {
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });
    });
  });
}
