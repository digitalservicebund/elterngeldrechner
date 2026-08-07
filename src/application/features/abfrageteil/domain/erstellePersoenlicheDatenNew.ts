import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeGeschwisterkinder } from "./findeGeschwisterkinder";
import { findeSozialversicherungen } from "./findeSozialversicherungenNew";
import { findeTaetigkeiten } from "./findeTaetigkeiten";
import { sindBeideElternteile } from "./sindBeideElternteile";
import { sindMischeinkunft } from "./sindMischeinkunft";
import { ueberpruefeErwerbstaetigkeit } from "./ueberpruefeErwerbstaetigkeit";
import type { FormEvent } from "@/application/routing/FormEvent";
import { Route } from "@/application/routing/Route";
import {
  ErwerbsArt,
  Geburtstag,
  type PersoenlicheDaten,
  Steuerklasse,
} from "@/elterngeldrechner";
import { Elternteil } from "@/monatsplaner/Elternteil";

export function erstellePersoenlicheDatenAllerElternteile(
  events: FormEvent[],
): PersoenlicheDatenAllerElternteile {
  if (sindBeideElternteile(events)) {
    return {
      anzahlElternteile: 2,
      [Elternteil.Eins]: erstellePersoenlicheDaten(events, 0),
      [Elternteil.Zwei]: erstellePersoenlicheDaten(events, 1),
    };
  }

  return {
    anzahlElternteile: 1,
    [Elternteil.Eins]: erstellePersoenlicheDaten(events, 0),
  };
}

type PersoenlicheDatenEinesElternteils = {
  readonly anzahlElternteile: 1;
  readonly [Elternteil.Eins]: PersoenlicheDaten;
};

type PersoenlicheDatenBeiderElternteile = {
  readonly anzahlElternteile: 2;
  readonly [Elternteil.Eins]: PersoenlicheDaten;
  readonly [Elternteil.Zwei]: PersoenlicheDaten;
};

export type PersoenlicheDatenAllerElternteile =
  PersoenlicheDatenEinesElternteils | PersoenlicheDatenBeiderElternteile;

export function erstellePersoenlicheDaten(
  events: FormEvent[],
  elternteilIndex: number,
): PersoenlicheDaten {
  const geburtsdatum = findeGeburtsdatum(events);
  const anzahlKuenftigerKinder = findeAnzahlKinder(events);
  const geschwisterkinder = findeGeschwisterkinder(events);

  return {
    anzahlKuenftigerKinder,
    geburtstagDesKindes: new Geburtstag(geburtsdatum.toString()),
    etVorGeburt: findeErwerbsartVorGeburt(events, elternteilIndex),
    geschwister: geschwisterkinder.map((kind) => ({
      geburtstag: new Geburtstag(kind.geburtsdatum.toString()),
      istBehindert: kind.hatBehinderung,
    })),
  };
}

function findeErwerbsartVorGeburt(
  events: FormEvent[],
  elternteilIndex: number,
): ErwerbsArt {
  const hatErwerbstaetigkeit = ueberpruefeErwerbstaetigkeit(
    events,
    elternteilIndex,
  );

  if (!hatErwerbstaetigkeit) {
    return ErwerbsArt.NEIN;
  }

  const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);

  if (sindMischeinkunft(taetigkeiten)) {
    return ErwerbsArt.JA_MISCHEINKOMMEN;
  }

  if (taetigkeiten.istSelbststaendig) {
    return ErwerbsArt.JA_SELBSTSTAENDIG;
  }

  if (taetigkeiten.hatMinijob === true) {
    return ErwerbsArt.JA_NICHT_SELBST_MINI;
  }

  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
  );

  // Nur istGesetzlichRentenversichert entscheidet MIT_SOZI vs. OHNE_SOZI,
  // weil brutto-netto-rechner.ts (abzuege/nettoEinkommenZwischenErgebnis)
  // für OHNE_SOZI ohnehin sowohl renten- als auch krankenversicherungspflichtig
  // auf false erzwingt, unabhängig von istGesetzlichKrankenpflichtversichert.
  // Die separate KV-Angabe hat für diese Klassifikation daher keinen Einfluss.
  if (sozialversicherungen.istGesetzlichRentenversichert) {
    return ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
  }

  return ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstellePersoenlicheDatenBeiderElternteile", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    const kindEvent: FormEvent = {
      route: Route.GeborenesKindAngaben,
      payload: {
        geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
        errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
        anzahl: 1,
      },
    };

    it("returns anzahlElternteile 1 when zweite Person is not considered", () => {
      const events: FormEvent[] = [
        kindEvent,
        {
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: false,
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
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
        },
      ];

      const result = erstellePersoenlicheDatenAllerElternteile(events);

      expect(result).toEqual({
        anzahlElternteile: 1,
        [Elternteil.Eins]: erstellePersoenlicheDaten(events, 0),
      });
    });

    it("returns anzahlElternteile 2 with both PersoenlicheDaten when zweite Person is considered", () => {
      const events: FormEvent[] = [
        kindEvent,
        {
          route: Route.ElternteilGemeinsamePlanungAbfrage,
          payload: {
            wirdZweitePersonBeruecksichtigt: true,
          },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatPeriodenOhneEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: true,
            wirdZweitePersonBeruecksichtigt: true,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { name: "Max" },
          dependentValues: {
            istSchwangerschaftsbedingteErkrankungMoeglich: true,
            naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: 0,
          },
        },
        {
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
            wirdZweitePersonBeruecksichtigt: true,
          },
        },
      ];

      const result = erstellePersoenlicheDatenAllerElternteile(events);

      expect(result).toEqual({
        anzahlElternteile: 2,
        [Elternteil.Eins]: erstellePersoenlicheDaten(events, 0),
        [Elternteil.Zwei]: erstellePersoenlicheDaten(events, 1),
      });
    });
  });

  describe("erstellePersoenlicheDaten", async () => {
    const { Temporal } = await import("@js-temporal/polyfill");

    const geborenesKindEvent: FormEvent = {
      route: Route.GeborenesKindAngaben,
      payload: {
        geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
        errechneterEntbindungstermin: Temporal.PlainDate.from("2025-06-10"),
        anzahl: 1,
      },
    };

    const taetigkeitenEvent: FormEvent = {
      route: Route.ElternteilTaetigkeitenAbfrage,
      params: { elternteilIndex: 0 },
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
    };

    const erstelleHauptjobEvent = (
      istGesetzlichRentenversichert: boolean,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
      params: { elternteilIndex: 0, angestelltIndex: 0 },
      payload: {
        steuerklasse: Steuerklasse.I,
        istKirchensteuerpflichtig: false,
        istGesetzlichKrankenpflichtversichert: true,
        istGesetzlichRentenversichert,
        istGesetzlichArbeitlosenversichert: true,
      },
      dependentValues: { kannDurchschnittAngegebenWerden: true },
    });

    describe("geburtstagDesKindes", () => {
      it("is derived from the Kind events", () => {
        const result = erstellePersoenlicheDaten(
          [geborenesKindEvent, taetigkeitenEvent],
          0,
        );

        expect(result.geburtstagDesKindes).toEqual(
          new Geburtstag("2025-06-15"),
        );
      });
    });

    describe("anzahlKuenftigerKinder", () => {
      it("is derived from the Kind events", () => {
        const events: FormEvent[] = [
          {
            route: Route.GeborenesKindAngaben,
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2025-06-15"),
              errechneterEntbindungstermin:
                Temporal.PlainDate.from("2025-06-10"),
              anzahl: 2,
            },
          },
          taetigkeitenEvent,
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.anzahlKuenftigerKinder).toBe(2);
      });
    });

    describe("geschwister", () => {
      it("is empty when no Geschwisterkind events exist", () => {
        const result = erstellePersoenlicheDaten(
          [geborenesKindEvent, taetigkeitenEvent],
          0,
        );

        expect(result.geschwister).toEqual([]);
      });

      it("maps Geschwisterkinder to Kind with Geburtstag and istBehindert", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          taetigkeitenEvent,
          {
            route: Route.GeschwisterkindAngaben,
            params: { geschwisterkindIndex: 0 },
            payload: {
              name: "Luise",
              geburtsdatum: Temporal.PlainDate.from("2021-03-10"),
              hatBehinderung: true,
            },
            dependentValues: {
              anzahlGeschwisterkinder: 1,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.geschwister).toEqual([
          { geburtstag: new Geburtstag("2021-03-10"), istBehindert: true },
        ]);
      });
    });

    describe("etVorGeburt", () => {
      it("is NEIN when no Taetigkeiten event exists", () => {
        const result = erstellePersoenlicheDaten([geborenesKindEvent], 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });

      it("is NEIN when only hatPeriodenOhneEinkommen is true", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
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
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });

      it("is JA_SELBSTSTAENDIG when only selbstständig besides keinEinkommen", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: true,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_SELBSTSTAENDIG);
      });

      it("is JA_MISCHEINKOMMEN when both selbstständig and nicht-selbstständig", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: true,
              istSelbststaendig: true,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_MISCHEINKOMMEN);
      });

      it("is JA_NICHT_SELBST_MINI when only minijob", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatMinijob: true,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      });

      it("is JA_MISCHEINKOMMEN when a Minijob is combined with a sozialversicherungspflichtige Tätigkeit", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatMinijob: true,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_MISCHEINKOMMEN);
      });

      it("is JA_NICHT_SELBST_MIT_SOZI when der Hauptjob sozialversicherungspflichtig ist", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
          erstelleHauptjobEvent(true),
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      });

      it("is JA_NICHT_SELBST_OHNE_SOZI when der Hauptjob nicht sozialversicherungspflichtig ist", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
          erstelleHauptjobEvent(false),
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI);
      });

      it("is JA_NICHT_SELBST_MIT_SOZI when nur verbeamtet und der Hauptjob sozialversicherungspflichtig ist", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: false,
              istVerbeamtet: true,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
          erstelleHauptjobEvent(true),
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      });

      it("is JA_NICHT_SELBST_OHNE_SOZI when nur verbeamtet und der Hauptjob nicht sozialversicherungspflichtig ist", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: false,
              istVerbeamtet: true,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
          erstelleHauptjobEvent(false),
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI);
      });

      it("uses only events for the given elternteilIndex", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 1 },
            payload: {
              hatPeriodenOhneEinkommen: false,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
              wirdZweitePersonBeruecksichtigt: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
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
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });
    });
  });
}
