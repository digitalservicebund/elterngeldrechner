import { findeAnzahlKinder } from "./findeAnzahlKinder";
import { findeGeburtsdatum } from "./findeGeburtsdatum";
import { findeGeschwisterkinder } from "./findeGeschwisterkinder";
import { findeSozialversicherungen } from "./findeSozialversicherungen";
import { sindBeideElternteile } from "./sindBeideElternteile";
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
  const hatErwerbstaetigkeit = ueberpruefeErwerbstaetigkeit(
    events,
    elternteilIndex,
  );

  if (!hatErwerbstaetigkeit) {
    return ErwerbsArt.NEIN;
  }

  const alleTaetigkeitEvents = findeTaetigkeitAngabenEvents(
    events,
    elternteilIndex,
  );

  const hatSelbststaendig = alleTaetigkeitEvents.some(
    (e) => e.route === Route.ElternteilTaetigkeitAngabenSelbststaendig,
  );
  const hatNichtSelbststaendig = alleTaetigkeitEvents.some(
    (e) => e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
  );

  if (hatSelbststaendig && hatNichtSelbststaendig) {
    return ErwerbsArt.JA_MISCHEINKOMMEN;
  }

  if (hatSelbststaendig) {
    return ErwerbsArt.JA_SELBSTSTAENDIG;
  }

  const alleNichtSelbststaendigEvents = alleTaetigkeitEvents.filter(
    (e): e is NichtSelbststaendigEvent =>
      e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
  );

  if (alleNichtSelbststaendigEvents.length === 0) {
    throw new Error(
      `No Taetigkeit events found for elternteil ${elternteilIndex}.`,
    );
  }

  const alleSozialversicherungspflichtigenJobEvents =
    alleNichtSelbststaendigEvents.filter(
      (e) => !e.payload.istTaetigkeitMinijob,
    );

  if (alleSozialversicherungspflichtigenJobEvents.length === 0) {
    return ErwerbsArt.JA_NICHT_SELBST_MINI;
  }

  const hatRentenversicherung =
    alleSozialversicherungspflichtigenJobEvents.some(
      (e) =>
        findeSozialversicherungen(
          events,
          elternteilIndex,
          e.params.taetigkeitIndex,
        ).istGesetzlichRentenversichert,
    );

  if (hatRentenversicherung) {
    return ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
  }

  return ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
}

function findeTaetigkeitAngabenEvents(
  events: FormEvent[],
  elternteilIndex: number,
): TaetigkeitEvent[] {
  const relevantEvents = events.filter((e): e is TaetigkeitEvent => {
    return (
      (e.route === Route.ElternteilTaetigkeitAngabenSelbststaendig ||
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig) &&
      e.params.elternteilIndex === elternteilIndex
    );
  });

  const byIndex = new Map<number, TaetigkeitEvent>();
  for (const event of relevantEvents) {
    byIndex.set(event.params.taetigkeitIndex, event);
  }

  return Array.from(byIndex.entries())
    .sort(([a], [b]) => a - b)
    .map(([, event]) => event);
}

type SelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenSelbststaendig }
>;

type NichtSelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

type TaetigkeitEvent = SelbststaendigEvent | NichtSelbststaendigEvent;

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
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { name: "Max" },
          dependentValues: { hatPotenzielleAusklammerungen: true },
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
            },
            dependentValues: {
              anzahlGeschwister: 1,
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 60000,
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 24000,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
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
              hatPeriodenOhneEinkommen: true,
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
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      });

      it("is JA_NICHT_SELBST_MINI when all nicht-selbstständige Tätigkeiten are minijobs", () => {
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MINI);
      });

      it("is JA_NICHT_SELBST_MIT_SOZI when minijob comes first but a sozialversicherungspflichtige Tätigkeit follows", () => {
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
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

      it("is JA_NICHT_SELBST_MIT_SOZI when sozialversicherungspflichtig", () => {
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
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
              hatPeriodenOhneEinkommen: false,
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
            dependentValues: { kannDurchschnittAngegebenWerden: true },
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

      it("is JA_NICHT_SELBST_MIT_SOZI when multiple nicht-selbstständige sozialversicherungspflichtige Tätigkeiten exist", () => {
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
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
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI);
      });

      it("is JA_NICHT_SELBST_MIT_SOZI when first nicht-selbstständige Tätigkeit has no Rentenversicherung but second does", () => {
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
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
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
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSozialversicherungen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
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

      it("is JA_MISCHEINKOMMEN when Abfrage only lists nicht-selbstständig but a selbstständige Tätigkeit was added later", () => {
        const events: FormEvent[] = [
          geborenesKindEvent,
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatPeriodenOhneEinkommen: true,
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
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: {
              istKirchensteuerpflichtig: false,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 24000,
            },
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.JA_MISCHEINKOMMEN);
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
          },
        ];

        const result = erstellePersoenlicheDaten(events, 0);

        expect(result.etVorGeburt).toBe(ErwerbsArt.NEIN);
      });
    });
  });
}
