import { findeSozialversicherungen } from "./findeSozialversicherungen";
import { findeTaetigkeiten } from "./findeTaetigkeiten";
import { sindBeideElternteile } from "./sindBeideElternteile";
import type { FormEvent } from "@/application/features/abfrageteil-next/routing/FormEvent";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import {
  Einkommen,
  ErwerbsTaetigkeit,
  type FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import type { MischEkTaetigkeit } from "@/elterngeldrechner/model/misch-ek-taetigkeit";
import { Elternteil } from "@/monatsplaner/Elternteil";

export function erstelleFinanzdatenAllerElternteile(
  events: FormEvent[],
): FinanzdatenAllerElternteile {
  if (sindBeideElternteile(events)) {
    return {
      anzahlElternteile: 2,
      [Elternteil.Eins]: erstelleFinanzDaten(events, 0),
      [Elternteil.Zwei]: erstelleFinanzDaten(events, 1),
    };
  }

  return {
    anzahlElternteile: 1,
    [Elternteil.Eins]: erstelleFinanzDaten(events, 0),
  };
}

type FinanzdatenEinesElternteils = {
  readonly anzahlElternteile: 1;
  readonly [Elternteil.Eins]: Omit<FinanzDaten, "kinderFreiBetrag">;
};

type FinanzdatenBeiderElternteile = {
  readonly anzahlElternteile: 2;
  readonly [Elternteil.Eins]: Omit<FinanzDaten, "kinderFreiBetrag">;
  readonly [Elternteil.Zwei]: Omit<FinanzDaten, "kinderFreiBetrag">;
};

export type FinanzdatenAllerElternteile =
  | FinanzdatenEinesElternteils
  | FinanzdatenBeiderElternteile;

export function erstelleFinanzDaten(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);

  if (taetigkeiten.hatKeinEinkommen) {
    return {
      bruttoEinkommen: new Einkommen(0),
      istKirchensteuerpflichtig: false,
      steuerklasse: Steuerklasse.I,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };
  }

  const alleTaetigkeitEvents = findeTaetigkeitEvents(events, elternteilIndex);

  if (alleTaetigkeitEvents.length > 1) {
    const alleNichtSelbststaendigOhneMinijob = alleTaetigkeitEvents.every(
      (e): e is NichtSelbststaendigEvent =>
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig &&
        !e.payload.istTaetigkeitMinijob,
    );

    if (alleNichtSelbststaendigOhneMinijob) {
      return erstelleAggregierteNichtSelbststaendigFinanzDaten(
        events,
        elternteilIndex,
        alleTaetigkeitEvents as NonEmpty<NichtSelbststaendigEvent>,
      );
    }

    const alleSelbststaendig = alleTaetigkeitEvents.every(
      (e): e is SelbststaendigEvent =>
        e.route === Route.ElternteilTaetigkeitAngabenSelbststaendig,
    );

    if (alleSelbststaendig) {
      return erstelleAggregiertesSelbststaendigFinanzDaten(
        alleTaetigkeitEvents as NonEmpty<SelbststaendigEvent>,
      );
    }

    return erstelleMischeinkommenFinanzDaten(
      events,
      elternteilIndex,
      alleTaetigkeitEvents,
    );
  }

  const erstesEvent = alleTaetigkeitEvents[0];
  if (!erstesEvent) {
    throw new Error(
      `No Taetigkeit events found for elternteil ${elternteilIndex}.`,
    );
  }

  return erstelleEinfacheFinanzDaten(events, elternteilIndex, erstesEvent);
}

function findeTaetigkeitEvents(
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

  // Deduplicate by taetigkeitIndex, keeping the last event for each index.
  const byIndex = new Map<number, TaetigkeitEvent>();
  for (const event of relevantEvents) {
    byIndex.set(event.params.taetigkeitIndex, event);
  }

  return Array.from(byIndex.entries())
    .sort(([a], [b]) => a - b)
    .map(([, event]) => event);
}

function findeMonatsbrutto(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeitIndex: number,
): number[] {
  const gleichEvent = [...events].reverse().find((e): e is EinkommenEvent => {
    return (
      e.route === Route.ElternteilTaetigkeitAngabenEinkommen &&
      e.params.elternteilIndex === elternteilIndex &&
      e.params.taetigkeitIndex === taetigkeitIndex
    );
  });

  if (gleichEvent) {
    return new Array<number>(12).fill(
      gleichEvent.payload.durchschnittlichesMonatsbrutto,
    );
  }

  const detailEvent = [...events]
    .reverse()
    .find((e): e is EinkommenDetailsEvent => {
      return (
        e.route === Route.ElternteilTaetigkeitAngabenEinkommenDetails &&
        e.params.elternteilIndex === elternteilIndex &&
        e.params.taetigkeitIndex === taetigkeitIndex
      );
    });

  return detailEvent?.payload.monatsbrutto ?? new Array<number>(12).fill(0);
}

function durchschnittMonatsbrutto(monatsbrutto: number[]): number {
  return monatsbrutto.reduce((acc, val) => acc + val, 0) / 12;
}

function erstelleEinfacheFinanzDaten(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeitEvent: TaetigkeitEvent,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const { taetigkeitIndex } = taetigkeitEvent.params;

  if (
    taetigkeitEvent.route === Route.ElternteilTaetigkeitAngabenSelbststaendig
  ) {
    const { payload } = taetigkeitEvent;
    return {
      bruttoEinkommen: new Einkommen(payload.bruttoJahresgewinn / 12),
      istKirchensteuerpflichtig: payload.istKirchensteuerpflichtig,
      steuerklasse: Steuerklasse.I,
      kassenArt: payload.istGesetzlichKrankenpflichtversichert
        ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
        : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: payload.istGesetzlichRentenversichert
        ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
        : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };
  }

  const monatsbrutto = findeMonatsbrutto(
    events,
    elternteilIndex,
    taetigkeitIndex,
  );

  if (taetigkeitEvent.payload.istTaetigkeitMinijob) {
    return {
      bruttoEinkommen: new Einkommen(durchschnittMonatsbrutto(monatsbrutto)),
      istKirchensteuerpflichtig: false,
      steuerklasse: Steuerklasse.I,
      kassenArt: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };
  }

  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
    taetigkeitIndex,
  );

  return {
    bruttoEinkommen: new Einkommen(durchschnittMonatsbrutto(monatsbrutto)),
    istKirchensteuerpflichtig: sozialversicherungen.istKirchensteuerpflichtig,
    steuerklasse: sozialversicherungen.steuerklasse,
    kassenArt: sozialversicherungen.istGesetzlichKrankenpflichtversichert
      ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
      : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: sozialversicherungen.istGesetzlichRentenversichert
      ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
      : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

function erstelleAggregierteNichtSelbststaendigFinanzDaten(
  events: FormEvent[],
  elternteilIndex: number,
  alleTaetigkeitEvents: NonEmpty<NichtSelbststaendigEvent>,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const gesamtMonatsbrutto = alleTaetigkeitEvents.reduce((summe, event) => {
    const monatsbrutto = findeMonatsbrutto(
      events,
      elternteilIndex,
      event.params.taetigkeitIndex,
    );

    return summe + durchschnittMonatsbrutto(monatsbrutto);
  }, 0);

  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
    alleTaetigkeitEvents[0].params.taetigkeitIndex,
  );

  return {
    bruttoEinkommen: new Einkommen(gesamtMonatsbrutto),
    istKirchensteuerpflichtig: sozialversicherungen.istKirchensteuerpflichtig,
    steuerklasse: sozialversicherungen.steuerklasse,
    kassenArt: sozialversicherungen.istGesetzlichKrankenpflichtversichert
      ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
      : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: sozialversicherungen.istGesetzlichRentenversichert
      ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
      : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

function erstelleAggregiertesSelbststaendigFinanzDaten(
  alleTaetigkeitEvents: NonEmpty<SelbststaendigEvent>,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const gesamtMonatsbrutto = alleTaetigkeitEvents.reduce(
    (summe, event) => summe + event.payload.bruttoJahresgewinn / 12,
    0,
  );

  return {
    bruttoEinkommen: new Einkommen(gesamtMonatsbrutto),
    istKirchensteuerpflichtig:
      alleTaetigkeitEvents[0].payload.istKirchensteuerpflichtig,
    steuerklasse: Steuerklasse.I,
    kassenArt: alleTaetigkeitEvents[0].payload
      .istGesetzlichKrankenpflichtversichert
      ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
      : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: alleTaetigkeitEvents[0].payload
      .istGesetzlichRentenversichert
      ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
      : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

function erstelleMischeinkommenFinanzDaten(
  events: FormEvent[],
  elternteilIndex: number,
  alleTaetigkeitEvents: TaetigkeitEvent[],
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const mischEinkommenTaetigkeiten = alleTaetigkeitEvents
    .map((event) => erstelleMischEkTaetigkeit(events, elternteilIndex, event))
    .filter((taetigkeit) => taetigkeit.bemessungsZeitraumMonate.some(Boolean));

  const erstesNichtSelbststaendigEvent = alleTaetigkeitEvents.find(
    (e): e is NichtSelbststaendigEvent => {
      return e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
    },
  );

  const sozialversicherungen =
    erstesNichtSelbststaendigEvent !== undefined &&
    !erstesNichtSelbststaendigEvent.payload.istTaetigkeitMinijob
      ? findeSozialversicherungen(
          events,
          elternteilIndex,
          erstesNichtSelbststaendigEvent.params.taetigkeitIndex,
        )
      : undefined;

  return {
    bruttoEinkommen: new Einkommen(0),
    istKirchensteuerpflichtig:
      sozialversicherungen?.istKirchensteuerpflichtig ?? false,
    steuerklasse: sozialversicherungen?.steuerklasse ?? Steuerklasse.I,
    kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten,
    erwerbsZeitraumLebensMonatList: [],
  };
}

function erstelleMischEkTaetigkeit(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeitEvent: TaetigkeitEvent,
): MischEkTaetigkeit {
  const { taetigkeitIndex } = taetigkeitEvent.params;

  if (
    taetigkeitEvent.route === Route.ElternteilTaetigkeitAngabenSelbststaendig
  ) {
    const { payload } = taetigkeitEvent;
    return {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
      bruttoEinkommenDurchschnitt: payload.bruttoJahresgewinn / 12,
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
      istRentenVersicherungsPflichtig: payload.istGesetzlichRentenversichert,
      istKrankenVersicherungsPflichtig:
        payload.istGesetzlichKrankenpflichtversichert,
      istArbeitslosenVersicherungsPflichtig:
        payload.istGesetzlichArbeitlosenversichert,
    };
  }

  const monatsbrutto = findeMonatsbrutto(
    events,
    elternteilIndex,
    taetigkeitIndex,
  );

  if (taetigkeitEvent.payload.istTaetigkeitMinijob) {
    return {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.MINIJOB,
      bruttoEinkommenDurchschnitt: durchschnittMonatsbrutto(monatsbrutto),
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: monatsbrutto.map((brutto) => brutto > 0),
      istRentenVersicherungsPflichtig: false,
      istKrankenVersicherungsPflichtig: false,
      istArbeitslosenVersicherungsPflichtig: false,
    };
  }

  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
    taetigkeitIndex,
  );

  return {
    erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
    bruttoEinkommenDurchschnitt: durchschnittMonatsbrutto(monatsbrutto),
    bruttoEinkommenDurchschnittMidi: 0,
    bemessungsZeitraumMonate: monatsbrutto.map((brutto) => brutto > 0),
    istRentenVersicherungsPflichtig:
      sozialversicherungen.istGesetzlichRentenversichert,
    istKrankenVersicherungsPflichtig:
      sozialversicherungen.istGesetzlichKrankenpflichtversichert,
    istArbeitslosenVersicherungsPflichtig:
      sozialversicherungen.istGesetzlichArbeitlosenversichert,
  };
}

type NonEmpty<T> = [T, ...T[]];

type SelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenSelbststaendig }
>;

type NichtSelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig }
>;

type EinkommenEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenEinkommen }
>;

type EinkommenDetailsEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitAngabenEinkommenDetails }
>;

type TaetigkeitEvent = SelbststaendigEvent | NichtSelbststaendigEvent;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzDatenBeiderElternteile", () => {
    it("returns anzahlElternteile 1 when zweite Person is not considered", () => {
      const events: FormEvent[] = [
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

      const finanzdaten = erstelleFinanzdatenAllerElternteile(events);

      expect(finanzdaten).toEqual({
        anzahlElternteile: 1,
        [Elternteil.Eins]: {
          bruttoEinkommen: new Einkommen(0),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        },
      });
    });

    it("returns anzahlElternteile 2 with both FinanzDaten when zweite Person is considered", () => {
      const events: FormEvent[] = [
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

      const finanzdaten = erstelleFinanzdatenAllerElternteile(events);

      const leereFinanzDaten = {
        bruttoEinkommen: new Einkommen(0),
        istKirchensteuerpflichtig: false,
        steuerklasse: Steuerklasse.I,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      };

      expect(finanzdaten).toEqual({
        anzahlElternteile: 2,
        [Elternteil.Eins]: leereFinanzDaten,
        [Elternteil.Zwei]: leereFinanzDaten,
      });
    });
  });

  describe("erstelleFinanzDaten", () => {
    describe("Kein Einkommen", () => {
      it("returns Finanzdaten without Bruttoeinkommen if hatKeinEinkommen equals true", () => {
        const finanzdaten = erstelleFinanzDaten(
          [
            {
              route: Route.ElternteilTaetigkeitenAbfrage,
              params: { elternteilIndex: 0 },
              payload: { hatKeinEinkommen: true },
            },
          ],
          0,
        );

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(0),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        });
      });
    });

    describe("Nicht-selbständig", () => {
      it("derives bruttoEinkommen as average over 12 months of monatsbrutto", () => {
        const events: FormEvent[] = [
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
              istEinkommenGleichVerteilt: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              monatsbrutto: [
                2000, 2500, 3000, 3500, 4000, 3000, 2000, 2500, 3000, 3500,
                4000, 3000,
              ],
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(3000),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        });
      });
    });

    describe("Minijob", () => {
      it("derives bruttoEinkommen as average over 12 months without sozialversicherungen", () => {
        const events: FormEvent[] = [
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
          {
            route: Route.ElternteilTaetigkeitAngabenMinijob,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istEinkommenGleichVerteilt: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 556 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(556),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        });
      });
    });

    describe("Selbständig", () => {
      it("derives bruttoEinkommen from bruttoJahresgewinn divided by 12", () => {
        const events: FormEvent[] = [
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
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              istKirchensteuerpflichtig: true,
              istGesetzlichKrankenpflichtversichert: false,
              istGesetzlichRentenversichert: false,
              istGesetzlichArbeitlosenversichert: false,
              bruttoJahresgewinn: 60000,
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(5000),
          istKirchensteuerpflichtig: true,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [],
          erwerbsZeitraumLebensMonatList: [],
        });
      });
    });

    describe("Selbständig mit mehreren Tätigkeiten", () => {
      it("produces mischEinkommenTaetigkeiten for both activities", () => {
        const events: FormEvent[] = [
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
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 400 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(0),
          istKirchensteuerpflichtig: false,
          steuerklasse: Steuerklasse.I,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1,
          mischEinkommenTaetigkeiten: [
            {
              erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
              bruttoEinkommenDurchschnitt: 3000,
              bruttoEinkommenDurchschnittMidi: 0,
              bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
              istRentenVersicherungsPflichtig: true,
              istKrankenVersicherungsPflichtig: true,
              istArbeitslosenVersicherungsPflichtig: true,
            },
            {
              erwerbsTaetigkeit: ErwerbsTaetigkeit.MINIJOB,
              bruttoEinkommenDurchschnitt: 400,
              bruttoEinkommenDurchschnittMidi: 0,
              bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
              istRentenVersicherungsPflichtig: false,
              istKrankenVersicherungsPflichtig: false,
              istArbeitslosenVersicherungsPflichtig: false,
            },
          ],
          erwerbsZeitraumLebensMonatList: [],
        });
      });

      it("sets bemessungsZeitraumMonate false for months with monatsbrutto = 0", () => {
        const events: FormEvent[] = [
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
              istEinkommenGleichVerteilt: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommenDetails,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              monatsbrutto: [
                3000, 3000, 3000, 0, 0, 0, 3000, 3000, 3000, 3000, 3000, 3000,
              ],
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 400 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.mischEinkommenTaetigkeiten[0]).toEqual({
          erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
          bruttoEinkommenDurchschnitt: 2250,
          bruttoEinkommenDurchschnittMidi: 0,
          bemessungsZeitraumMonate: [
            true,
            true,
            true,
            false,
            false,
            false,
            true,
            true,
            true,
            true,
            true,
            true,
          ],
          istRentenVersicherungsPflichtig: true,
          istKrankenVersicherungsPflichtig: true,
          istArbeitslosenVersicherungsPflichtig: true,
        });
      });
    });

    describe("Mischeinkünfte", () => {
      it("produces mischEinkommenTaetigkeiten, selbstständig is index 0, nicht-selbstständig is index 1", () => {
        const events: FormEvent[] = [
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
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(0));
        expect(finanzdaten.mischEinkommenTaetigkeiten).toEqual([
          {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt: 2000,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
            istRentenVersicherungsPflichtig: false,
            istKrankenVersicherungsPflichtig: false,
            istArbeitslosenVersicherungsPflichtig: false,
          },
          {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt: 3000,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
            istRentenVersicherungsPflichtig: true,
            istKrankenVersicherungsPflichtig: true,
            istArbeitslosenVersicherungsPflichtig: true,
          },
        ]);
      });
    });

    describe("Mehrere nicht-selbstständige Tätigkeiten", () => {
      it("aggregates brutto into bruttoEinkommen and leaves mischEinkommenTaetigkeiten empty", () => {
        const events: FormEvent[] = [
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
              istKirchensteuerpflichtig: true,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
              istEinkommenGleichVerteilt: true,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 4000 },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 2 },
            payload: { istTaetigkeitMinijob: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 2 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(10000));
        expect(finanzdaten.mischEinkommenTaetigkeiten).toEqual([]);
        expect(finanzdaten.istKirchensteuerpflichtig).toBe(true);
        expect(finanzdaten.kassenArt).toBe(
          KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        );
        expect(finanzdaten.rentenVersicherung).toBe(
          RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        );
      });
    });

    describe("Mehrere selbstständige Tätigkeiten", () => {
      it("aggregates brutto into bruttoEinkommen and leaves mischEinkommenTaetigkeiten empty", () => {
        const events: FormEvent[] = [
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
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: {
              bruttoJahresgewinn: 24000,
              istKirchensteuerpflichtig: true,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: {
              bruttoJahresgewinn: 12000,
              istKirchensteuerpflichtig: true,
              istGesetzlichKrankenpflichtversichert: true,
              istGesetzlichRentenversichert: true,
              istGesetzlichArbeitlosenversichert: true,
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten.bruttoEinkommen).toEqual(new Einkommen(3000));
        expect(finanzdaten.mischEinkommenTaetigkeiten).toEqual([]);
      });
    });
  });
}
