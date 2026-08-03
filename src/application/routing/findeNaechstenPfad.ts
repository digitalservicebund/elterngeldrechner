import { Temporal } from "@js-temporal/polyfill";
import { FormEvent } from "./FormEvent";
import { Route } from "./Route";
import { generateAbfrageteilPath } from "./generatePath/generateAbfrageteilPath";
import { generateParametrizedPath } from "./generatePath/generateParametrizedPath";
import { Steuerklasse } from "@/elterngeldrechner";
import { isNewIncomeFlowEnabled } from "../feature-flags";

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
    case Route.UngeborenesKindAngaben:
      return event.dependentValues.istGeburtWahrscheinlich
        ? Route.WahrscheinlichGeborenesKindAbfrage
        : Route.GeschwisterkindAbfrage;
    case Route.WahrscheinlichGeborenesKindAbfrage:
      return Route.GeschwisterkindAbfrage;
    case Route.GeschwisterkindAbfrage:
      return event.payload.istVorhanden
        ? Route.GeschwisterkindAnzahlAbfrage
        : Route.ElternteilEinsAllgemeineAngaben;
    case Route.GeschwisterkindAnzahlAbfrage:
      return generateParametrizedPath(Route.GeschwisterkindAngaben, {
        geschwisterkindIndex: "0",
      });
    case Route.GeschwisterkindAngaben:
      return event.dependentValues.anzahlGeschwisterkinder >
        event.params.geschwisterkindIndex + 1
        ? generateParametrizedPath(Route.GeschwisterkindAngaben, {
            geschwisterkindIndex: (
              event.params.geschwisterkindIndex + 1
            ).toString(),
          })
        : Route.GeschwisterbonusUebersicht;
    case Route.GeschwisterbonusUebersicht:
      return Route.ElternteilEinsAllgemeineAngaben;
    case Route.ElternteilEinsAllgemeineAngaben: {
      const zielRoute = event.payload.istAlleinerziehend
        ? Route.ElternteilAusklammerungErkrankungAbfrage
        : Route.ElternteilGemeinsamePlanungAbfrage;
      return generateParametrizedPath(zielRoute, {
        elternteilIndex: "0",
      });
    }
    case Route.ElternteilGemeinsamePlanungAbfrage:
      return generateParametrizedPath(
        Route.ElternteilAusklammerungErkrankungAbfrage,
        {
          elternteilIndex: "0",
        },
      );
    case Route.ElternteilAusklammerungErkrankungAbfrage: {
      const { payload, params, dependentValues } = event;
      if (payload.hatSchwangerschaftsbedingteErkrankung) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungErkrankungZeitenAngaben,
          {
            elternteilIndex: params.elternteilIndex.toString(),
          },
        );
      }
      if (
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !==
        undefined
      ) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung?.toString(),
          },
        );
      }
      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungErkrankungZeitenAngaben: {
      const { params, dependentValues } = event;
      if (
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !==
        undefined
      ) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung?.toString(),
          },
        );
      }
      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungElternzeitAbfrage: {
      const { payload, params, dependentValues } = event;

      if (payload.hatElterngeldGeschwisterkind) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitZeitenAngaben,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex: params.geschwisterIndex.toString(),
          },
        );
      }

      const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung;
      if (
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined &&
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung ===
          params.geschwisterIndex
      ) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungMutterschutzAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex: params.geschwisterIndex.toString(),
          },
        );
      }
      if (naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              naechsterGeschwisterIndexMitRelevanzFuerAusklammerung.toString(),
          },
        );
      }

      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungElternzeitZeitenAngaben: {
      const { params, dependentValues } = event;

      const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung;
      if (
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined &&
        naechsterGeschwisterIndexMitRelevanzFuerAusklammerung ===
          params.geschwisterIndex
      ) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungMutterschutzAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex: params.geschwisterIndex.toString(),
          },
        );
      }
      if (naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              naechsterGeschwisterIndexMitRelevanzFuerAusklammerung.toString(),
          },
        );
      }

      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungMutterschutzAbfrage: {
      const { payload, params, dependentValues } = event;

      if (payload.hatMutterschutzGeschwisterkind) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungMutterschutzZeitenAngaben,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex: params.geschwisterIndex.toString(),
          },
        );
      }

      const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung;
      if (naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              naechsterGeschwisterIndexMitRelevanzFuerAusklammerung.toString(),
          },
        );
      }

      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }
    case Route.ElternteilAusklammerungMutterschutzZeitenAngaben: {
      const { params, dependentValues } = event;

      const naechsterGeschwisterIndexMitRelevanzFuerAusklammerung =
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung;
      if (naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !== undefined) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            geschwisterIndex:
              naechsterGeschwisterIndexMitRelevanzFuerAusklammerung.toString(),
          },
        );
      }

      return generateParametrizedPath(Route.ElternteilTaetigkeitenAbfrage, {
        elternteilIndex: params.elternteilIndex.toString(),
      });
    }

    // Tätigkeiten
    // Tätigkeiten allgemein
    case Route.ElternteilTaetigkeitenAbfrage: {
      const { payload, dependentValues } = event;

      const hatErwerbstaetigkeit =
        payload.istNichtSelbststaendig ||
        payload.hatMinijob === true ||
        payload.istSelbststaendig ||
        payload.istVerbeamtet;

      if (!hatErwerbstaetigkeit) {
        return event.params.elternteilIndex === 1 ||
          dependentValues.istPersonAlleinerziehend ||
          !dependentValues.wirdZweitePersonBeruecksichtigt
          ? "DONE"
          : Route.ElternteilZweiAllgemeineAngaben;
      }

      return generateParametrizedPath(
        Route.ElternteilTaetigkeitenBMZUebersicht,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
        },
      );
    }
    case Route.ElternteilTaetigkeitenBMZUebersicht: {
      const { params, dependentValues } = event;
      const taetigkeiten = dependentValues.taetigkeiten;

      if (isNewIncomeFlowEnabled()) {
        if (taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet) {
          return generateParametrizedPath(
            Route.ElternteilTaetigkeitenAngestelltHauptjob,
            {
              elternteilIndex: params.elternteilIndex.toString(),
              angestelltIndex: "0",
            },
          );
        }

        if (taetigkeiten.hatMinijob) {
          return generateParametrizedPath(
            Route.ElternteilTaetigkeitenMinijobAngaben,
            {
              elternteilIndex: params.elternteilIndex.toString(),
              minijobIndex: "0",
            },
          );
        }

        return generateParametrizedPath(
          Route.ElternteilTaetigkeitenSelbststaendigAngaben,
          {
            elternteilIndex: params.elternteilIndex.toString(),
            selbststaendigIndex: "0",
          },
        );
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

    // Tätigkeiten angestellt
    case Route.ElternteilTaetigkeitenAngestelltHauptjob:
      return "WIP";
    case Route.ElternteilTaetigkeitenAngestelltAngaben:
      return "WIP";
    case Route.ElternteilTaetigkeitenAngestelltEinkommen:
      return "WIP";
    case Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert:
      return "WIP";
    case Route.ElternteilTaetigkeitenAngestelltWeitere:
      return "WIP";

    // Tätigkeiten Minijob
    case Route.ElternteilTaetigkeitenMinijobAngaben:
      return "WIP";
    case Route.ElternteilTaetigkeitenMinijobEinkommen:
      return "WIP";
    case Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert:
      return "WIP";
    case Route.ElternteilTaetigkeitenMinijobWeiterer:
      return "WIP";

    // Tätigkeiten selbstständig
    case Route.ElternteilTaetigkeitenSelbststaendigAngaben:
      return generateParametrizedPath(
        Route.ElternteilTaetigkeitenSelbststaendigWeitere,
        {
          elternteilIndex: event.params.elternteilIndex.toString(),
          selbststaendigIndex: event.params.selbststaendigIndex.toString(),
        },
      );
    case Route.ElternteilTaetigkeitenSelbststaendigWeitere: {
      const { payload, dependentValues, params } = event;
      if (!payload.istWeitereTaetigkeitVorhanden) {
        return !dependentValues.wirdZweitePersonBeruecksichtigt ||
          event.params.elternteilIndex === 1
          ? "DONE"
          : Route.ElternteilZweiAllgemeineAngaben;
      }

      return generateParametrizedPath(
        Route.ElternteilTaetigkeitenSelbststaendigAngaben,
        {
          elternteilIndex: params.elternteilIndex.toString(),
          selbststaendigIndex: (params.selbststaendigIndex + 1).toString(),
        },
      );
    }

    // Tätigkeiten bisherige Einkommensabfrage
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
      const { dependentValues } = event;
      if (dependentValues.istSchwangerschaftsbedingteErkrankungMoeglich) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungErkrankungAbfrage,
          {
            elternteilIndex: "1",
          },
        );
      }

      if (
        dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung !==
        undefined
      ) {
        return generateParametrizedPath(
          Route.ElternteilAusklammerungElternzeitAbfrage,
          {
            elternteilIndex: "1",
            geschwisterIndex:
              dependentValues.naechsterGeschwisterIndexMitRelevanzFuerAusklammerung?.toString(),
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
      it("returns GeschwisterkindAbfrage when the birth is not yet likely", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-18"),
            anzahl: 1,
          },
          dependentValues: { istGeburtWahrscheinlich: false },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind");
      });

      it("returns WahrscheinlichGeborenesKindAbfrage when the birth is likely", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.UngeborenesKindAngaben,
          payload: {
            errechneterEntbindungstermin: Temporal.PlainDate.from("2024-01-15"),
            anzahl: 1,
          },
          dependentValues: { istGeburtWahrscheinlich: true },
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
            anzahlGeschwisterkinder: 1,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/0");
      });
    });

    describe("GeschwisterkindAngaben", () => {
      it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals zero and anzahlGeschwister is 2", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            name: "Luise",
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 2,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/1");
      });

      it("returns GeschwisterkindAngaben given GeschwisterkindAngaben as currentRoute, index equals one and anzahlGeschwister is 3", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 1 },
          payload: {
            name: "Luise",
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 3,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/geschwisterkind/2");
      });

      it("returns GeschwisterbonusUebersicht given GeschwisterkindAngaben as currentRoute, index equals zero and anzahlGeschwister is 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.GeschwisterkindAngaben,
          params: { geschwisterkindIndex: 0 },
          payload: {
            name: "Luise",
            geburtsdatum: Temporal.Now.plainDateISO(),
            hatBehinderung: false,
          },
          dependentValues: {
            anzahlGeschwisterkinder: 1,
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
      it("returns ElternteilAusklammerungErkrankungAbfrage given ElternteilEinsAllgemeineAngaben as currentRoute and istAlleinerziehend true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilEinsAllgemeineAngaben,
          payload: {
            name: "Vorname",
            istAlleinerziehend: true,
            istImMutterschutz: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/erkrankung",
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
      it("returns ElternteilAusklammerungErkrankungAbfrage given ElternteilGemeinsamePlanungAbfrage as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/erkrankung",
        );
      });
    });

    describe("ElternteilAusklammerungErkrankungAbfrage", () => {
      it("returns ElternteilAusklammerungErkrankungZeitenAngaben given ElternteilAusklammerungErkrankungAbfrage as currentRoute and hatSchwangerschaftsbedingteErkrankung true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungErkrankungAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatSchwangerschaftsbedingteErkrankung: true,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/erkrankung-zeiten",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage given ElternteilAusklammerungErkrankungAbfrage as currentRoute, istSchwangerschaftsbedingteErkrankungMoeglich false and anzahlGeschwister 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungErkrankungAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatSchwangerschaftsbedingteErkrankung: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/elternzeit",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungErkrankungAbfrage as currentRoute, istSchwangerschaftsbedingteErkrankungMoeglich false and anzahlGeschwister 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungErkrankungAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            hatSchwangerschaftsbedingteErkrankung: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungErkrankungZeitenAngaben", () => {
      it("returns ElternteilAusklammerungElternzeitAbfrage given ElternteilAusklammerungErkrankungZeitenAngaben as currentRoute and anzahlGeschwister 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungErkrankungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            erkrankungSchwangerschaft: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/elternzeit",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungErkrankungZeitenAngaben as currentRoute and anzahlGeschwister 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungErkrankungZeitenAngaben,
          params: { elternteilIndex: 0 },
          payload: {
            erkrankungSchwangerschaft: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungElternzeitAbfrage", () => {
      it("returns ElternteilAusklammerungElternzeitZeitenAngaben given ElternteilAusklammerungElternzeitAbfrage as currentRoute and hatElterngeldGeschwisterkind true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatElterngeldGeschwisterkind: true,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/elternzeit-zeiten",
        );
      });

      it("returns ElternteilAusklammerungMutterschutzAbfrage given ElternteilAusklammerungElternzeitAbfrage as currentRoute and hatElterngeldGeschwisterkind false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatElterngeldGeschwisterkind: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/mutterschutz",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage for next sibling given ElternteilAusklammerungElternzeitAbfrage as currentRoute, hatElterngeldGeschwisterkind false and nächsterGeschwisterIndex higher than current index", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatElterngeldGeschwisterkind: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 1,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/1/elternzeit",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungElternzeitAbfrage as currentRoute, hatElterngeldGeschwisterkind false and no further siblings", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatElterngeldGeschwisterkind: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungElternzeitZeitenAngaben", () => {
      it("returns ElternteilAusklammerungMutterschutzAbfrage given ElternteilAusklammerungErkrankungAbfrage as currentRoute and index 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitZeitenAngaben,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            elterngeldGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/mutterschutz",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage for next sibling given ElternteilAusklammerungElternzeitZeitenAngaben as currentRoute and nächsterGeschwisterIndex higher than current index", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitZeitenAngaben,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            elterngeldGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 1,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/1/elternzeit",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungElternzeitZeitenAngaben as currentRoute and no further siblings", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungElternzeitZeitenAngaben,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            elterngeldGeschwisterkind: [
              {
                von: Temporal.PlainDate.from("2025-12-23"),
                bis: Temporal.PlainDate.from("2026-02-05"),
              },
            ],
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });
    });

    describe("ElternteilAusklammerungMutterschutzAbfrage", () => {
      it("returns ElternteilAusklammerungMutterschutzZeitenAngaben given ElternteilAusklammerungMutterschutzAbfrage as currentRoute and hatMutterschutzGeschwisterkind true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungMutterschutzAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatMutterschutzGeschwisterkind: true,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/0/mutterschutz-zeiten",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungMutterschutzAbfrage as currentRoute and hatMutterschutzGeschwisterkind false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungMutterschutzAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatMutterschutzGeschwisterkind: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage given ElternteilAusklammerungMutterschutzAbfrage as currentRoute, hatMutterschutzGeschwisterkind false and anzahlGeschwister higher than current index", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungMutterschutzAbfrage,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            hatMutterschutzGeschwisterkind: false,
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 1,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/1/elternzeit",
        );
      });
    });

    describe("ElternteilAusklammerungMutterschutzZeitenAngaben", () => {
      it("returns ElternteilTaetigkeitenAbfrage given ElternteilAusklammerungMutterschutzZeitenAngaben as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungMutterschutzZeitenAngaben,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            mutterschutzGeschwisterkind: {
              von: Temporal.PlainDate.from("2025-12-23"),
              bis: Temporal.PlainDate.from("2026-02-05"),
            },
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/abfrage",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage given ElternteilAusklammerungMutterschutzZeitenAngaben as currentRoute and anzahlGeschwister higher than current index", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilAusklammerungMutterschutzZeitenAngaben,
          params: {
            elternteilIndex: 0,
            geschwisterIndex: 0,
          },
          payload: {
            mutterschutzGeschwisterkind: {
              von: Temporal.PlainDate.from("2025-12-23"),
              bis: Temporal.PlainDate.from("2026-02-05"),
            },
          },
          dependentValues: {
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 1,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/ausklammerung/1/elternzeit",
        );
      });
    });

    describe("ElternteilTaetigkeitenAbfrage", () => {
      it("returns ElternteilTaetigkeitenBMZUebersicht given ElternteilTaetigkeitenAbfrage as currentRoute and elternteilIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/bmz",
        );
      });

      it("returns ElternteilTaetigkeitenBMZUebersicht given ElternteilTaetigkeitenAbfrage as currentRoute and only hatMinijob true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            hatMinijob: true,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
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
            istNichtSelbststaendig: true,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/bmz",
        );
      });

      it("returns ElternteilZweiAllgemeineAngaben given ElternteilTaetigkeitenAbfrage as currentRoute and only hatAndereLeistungen true and elternteilIndex 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/1");
      });

      it("returns BeispielePage given ElternteilTaetigkeitenAbfrage as currentRoute and only hatAndereLeistungen true and elternteilIndex 0 and istPersonAlleinerziehend true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: true,
            hatPeriodenOhneEinkommen: false,
          },
          dependentValues: {
            istPersonAlleinerziehend: true,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns path for BeispielePage given ElternteilTaetigkeitenAbfrage as currentRoute and hatPeriodenOhneEinkommen true and elternteilIndex 1", () => {
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
          dependentValues: {
            istPersonAlleinerziehend: false,
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });
    });

    describe("ElternteilTaetigkeitenBMZUebersicht", () => {
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

      describe("wenn der neue Einkommensfluss aktiv ist", () => {
        beforeEach(() => {
          vi.stubEnv("VITE_FEATURE_FLAG_INCOME_FLOW", "true");
        });

        afterEach(() => {
          vi.unstubAllEnvs();
        });

        it("returns ElternteilTaetigkeitenAngestelltHauptjob given istNichtSelbststaendig true", () => {
          const naechsterPfad = findeNaechstenPfad({
            route: Route.ElternteilTaetigkeitenBMZUebersicht,
            params: { elternteilIndex: 0 },
            dependentValues: {
              istPersonAlleinerziehend: false,
              taetigkeiten: {
                istNichtSelbststaendig: true,
                hatMinijob: false,
                istSelbststaendig: false,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatPeriodenOhneEinkommen: false,
              },
            },
          });

          expect(naechsterPfad).toEqual(
            "/abfrageteil/elternteil/0/finanzielles/taetigkeit/angestellt/0/hauptjob",
          );
        });

        it("returns ElternteilTaetigkeitenAngestelltHauptjob given istNichtSelbststaendig and hatMinijob both true", () => {
          const naechsterPfad = findeNaechstenPfad({
            route: Route.ElternteilTaetigkeitenBMZUebersicht,
            params: { elternteilIndex: 0 },
            dependentValues: {
              istPersonAlleinerziehend: false,
              taetigkeiten: {
                istNichtSelbststaendig: true,
                hatMinijob: true,
                istSelbststaendig: false,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatPeriodenOhneEinkommen: false,
              },
            },
          });

          expect(naechsterPfad).toEqual(
            "/abfrageteil/elternteil/0/finanzielles/taetigkeit/angestellt/0/hauptjob",
          );
        });

        it("returns ElternteilTaetigkeitenMinijobAngaben given only hatMinijob true", () => {
          const naechsterPfad = findeNaechstenPfad({
            route: Route.ElternteilTaetigkeitenBMZUebersicht,
            params: { elternteilIndex: 0 },
            dependentValues: {
              istPersonAlleinerziehend: false,
              taetigkeiten: {
                istNichtSelbststaendig: false,
                hatMinijob: true,
                istSelbststaendig: false,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatPeriodenOhneEinkommen: false,
              },
            },
          });

          expect(naechsterPfad).toEqual(
            "/abfrageteil/elternteil/0/finanzielles/taetigkeit/minijob/0/angaben",
          );
        });

        it("returns ElternteilTaetigkeitenSelbststaendigAngaben given neither istNichtSelbststaendig nor hatMinijob true", () => {
          const naechsterPfad = findeNaechstenPfad({
            route: Route.ElternteilTaetigkeitenBMZUebersicht,
            params: { elternteilIndex: 0 },
            dependentValues: {
              istPersonAlleinerziehend: false,
              taetigkeiten: {
                istNichtSelbststaendig: false,
                hatMinijob: false,
                istSelbststaendig: true,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatPeriodenOhneEinkommen: false,
              },
            },
          });

          expect(naechsterPfad).toEqual(
            "/abfrageteil/elternteil/0/finanzielles/taetigkeit/selbststaendig/0/angaben",
          );
        });
      });
    });

    describe("ElternteilTaetigkeitenSelbststaendigAngaben", () => {
      it("returns ElternteilTaetigkeitenSelbststaendigWeitere given ElternteilTaetigkeitenSelbststaendigAngaben as currentRoute", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
          params: { elternteilIndex: 0, selbststaendigIndex: 0 },
          payload: {
            istKirchensteuerpflichtig: true,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            bruttoJahresgewinn: 10000,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/selbststaendig/0/weitere",
        );
      });

      it("carries the selbststaendigIndex through to ElternteilTaetigkeitenSelbststaendigWeitere", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
          params: { elternteilIndex: 0, selbststaendigIndex: 2 },
          payload: {
            istKirchensteuerpflichtig: true,
            istGesetzlichKrankenpflichtversichert: true,
            istGesetzlichRentenversichert: true,
            istGesetzlichArbeitlosenversichert: true,
            bruttoJahresgewinn: 10000,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/selbststaendig/2/weitere",
        );
      });
    });

    describe("ElternteilTaetigkeitenSelbststaendigWeitere", () => {
      it("returns ElternteilTaetigkeitenSelbststaendigAngaben for the next selbststaendigIndex given istWeitereTaetigkeitVorhanden true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigWeitere,
          params: { elternteilIndex: 0, selbststaendigIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: true,
          },
          dependentValues: {
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/0/finanzielles/taetigkeit/selbststaendig/1/angaben",
        );
      });

      it("returns ElternteilZweiAllgemeineAngaben given istWeitereTaetigkeitVorhanden false and wirdZweitePersonBeruecksichtigt true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigWeitere,
          params: { elternteilIndex: 0, selbststaendigIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual("/abfrageteil/elternteil/1");
      });

      it("returns /beispiele given istWeitereTaetigkeitVorhanden false and wirdZweitePersonBeruecksichtigt false", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigWeitere,
          params: { elternteilIndex: 0, selbststaendigIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            wirdZweitePersonBeruecksichtigt: false,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
      });

      it("returns /beispiele given istWeitereTaetigkeitVorhanden false, elternteilIndex 1 and wirdZweitePersonBeruecksichtigt true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilTaetigkeitenSelbststaendigWeitere,
          params: { elternteilIndex: 1, selbststaendigIndex: 0 },
          payload: {
            istWeitereTaetigkeitVorhanden: false,
          },
          dependentValues: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        });

        expect(naechsterPfad).toEqual("/beispiele");
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
      it("returns ElternteilAusklammerungErkrankungAbfrage given ElternteilZweiAllgemeineAngaben as currentRoute and istSchwangerschaftsbedingteErkrankungMoeglich true", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: {
            istSchwangerschaftsbedingteErkrankungMoeglich: true,
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung/erkrankung",
        );
      });

      it("returns ElternteilAusklammerungElternzeitAbfrage given ElternteilZweiAllgemeineAngaben as currentRoute, istSchwangerschaftsbedingteErkrankungMoeglich false and anzahlGeschwister 1", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: {
            istSchwangerschaftsbedingteErkrankungMoeglich: false,
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/ausklammerung/0/elternzeit",
        );
      });

      it("returns ElternteilTaetigkeitenAbfrage given ElternteilZweiAllgemeineAngaben as currentRoute, istSchwangerschaftsbedingteErkrankungMoeglich false and anzahlGeschwister 0", () => {
        const naechsterPfad = findeNaechstenPfad({
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: {
            name: "Person 2",
          },
          dependentValues: {
            istSchwangerschaftsbedingteErkrankungMoeglich: false,
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: undefined,
          },
        });

        expect(naechsterPfad).toEqual(
          "/abfrageteil/elternteil/1/finanzielles/taetigkeit/abfrage",
        );
      });
    });
  });
}
