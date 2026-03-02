import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeGeschwisterkinder } from "./findeGeschwisterkinder";
import { findeMinijob } from "./findeMinijob";
import { findeSozialversicherungen } from "./findeSozialversicherungen";
import { findeTaetigkeiten } from "./findeTaetigkeiten";
import { sindBeideElternteile } from "./sindBeideElternteile";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
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
  | PersoenlicheDatenEinesElternteils
  | PersoenlicheDatenBeiderElternteile;

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
  const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);

  if (taetigkeiten.hatKeinEinkommen) {
    return ErwerbsArt.NEIN;
  }

  const { istSelbststaendig, istNichtSelbststaendig } = taetigkeiten;

  if (istSelbststaendig && istNichtSelbststaendig) {
    return ErwerbsArt.JA_MISCHEINKOMMEN;
  }

  if (istSelbststaendig) {
    return ErwerbsArt.JA_SELBSTSTAENDIG;
  }

  const minijob = findeErsteMinijobInformation(events, elternteilIndex);
  if (minijob.istTaetigkeitMinijob) {
    return ErwerbsArt.JA_NICHT_SELBST_MINI;
  }

  const sozialversicherungen = findeErsteSozialversicherungInformation(
    events,
    elternteilIndex,
  );
  if (sozialversicherungen.istGesetzlichRentenversichert) {
    return ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
  }

  return ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
}

function findeErsteMinijobInformation(
  events: FormEvent[],
  elternteilIndex: number,
) {
  return findeMinijob(events, elternteilIndex, 0);
}

function findeErsteSozialversicherungInformation(
  events: FormEvent[],
  elternteilIndex: number,
) {
  return findeSozialversicherungen(events, elternteilIndex, 0);
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
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
        },
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false },
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
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: { hatKeinEinkommen: true },
        },
        {
          route: Route.ElternteilZweitePersonAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
        },
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 1 },
          payload: { hatKeinEinkommen: true },
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
      payload: { hatKeinEinkommen: true },
    };

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
            params: { geschwisterIndex: 0 },
            payload: {
              geburtsdatum: Temporal.PlainDate.from("2021-03-10"),
              hatBehinderung: true,
              istWeiteresGeschwisterkindVorhanden: false,
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
      it("throws when no Taetigkeiten event exists", () => {
        expect(() =>
          erstellePersoenlicheDaten([geborenesKindEvent], 0),
        ).toThrow();
      });

      it("is NEIN when hatKeinEinkommen is true", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: { hatKeinEinkommen: true },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });

      it("is JA_SELBSTSTAENDIG when only selbstständig", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: false,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
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
              hatKeinEinkommen: false,
              istSelbststaendig: true,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_MISCHEINKOMMEN);
      });

      it("is JA_NICHT_SELBST_MINI when minijob", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: true },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      });

      it("is JA_NICHT_SELBST_MIT_SOZI when sozialversicherungspflichtig", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              steuerklasse: Steuerklasse.I,
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
              istEinkommenGleichVerteilt: true,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      });

      it("is JA_NICHT_SELBST_OHNE_SOZI when nicht-selbstständig without social insurance", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: false,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              steuerklasse: Steuerklasse.I,
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              istEinkommenGleichVerteilt: true,
            },
          },
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
              hatKeinEinkommen: false,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: { hatKeinEinkommen: true },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });
    });
  });
}
