import { findeSozialversicherungen } from "./findeSozialversicherungen";
import { sindBeideElternteile } from "./sindBeideElternteile";
import { ueberpruefeErwerbstaetigkeit } from "./ueberpruefeErwerbstaetigkeit";
import { findeLetztesGueltigesEvent } from "@/application/features/abfrageteil-next/events/projections";
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
  const hatErwerbstaetigkeit = ueberpruefeErwerbstaetigkeit(
    events,
    elternteilIndex,
  );

  if (!hatErwerbstaetigkeit) {
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
    const alleNichtSelbststaendig = alleTaetigkeitEvents.every(
      (e): e is NichtSelbststaendigEvent =>
        e.route === Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
    );

    if (alleNichtSelbststaendig) {
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
  const gleichEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitAngabenEinkommen,
    { elternteilIndex, taetigkeitIndex },
  );

  if (gleichEvent) {
    return new Array<number>(12).fill(
      gleichEvent.durchschnittlichesMonatsbrutto,
    );
  }

  const detailEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitAngabenEinkommenDetails,
    { elternteilIndex, taetigkeitIndex },
  );

  return detailEvent?.monatsbrutto ?? new Array<number>(12).fill(0);
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
      bruttoEinkommen: new Einkommen(
        Math.max(payload.bruttoJahresgewinn / 12, 0),
      ),
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

  const erstesNichtMinijobEvent = alleTaetigkeitEvents.find(
    (e) => !e.payload.istTaetigkeitMinijob,
  );

  if (!erstesNichtMinijobEvent) {
    return {
      bruttoEinkommen: new Einkommen(gesamtMonatsbrutto),
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
    erstesNichtMinijobEvent.params.taetigkeitIndex,
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
    (summe, event) =>
      summe + Math.max(event.payload.bruttoJahresgewinn / 12, 0),
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
      bruttoEinkommenDurchschnitt: Math.max(payload.bruttoJahresgewinn / 12, 0),
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

type TaetigkeitEvent = SelbststaendigEvent | NichtSelbststaendigEvent;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzDatenBeiderElternteile", () => {
    it("returns anzahlElternteile 1 when zweite Person is not considered", () => {
      const events: FormEvent[] = [
        {
          route: Route.ElternteilTaetigkeitenAbfrage,
          params: { elternteilIndex: 0 },
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatKeinEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: false },
          dependentValues: { hatPotenzielleAusklammerungen: true },
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
          payload: {
            istNichtSelbststaendig: false,
            istSelbststaendig: false,
            istVerbeamtet: false,
            hatAndereLeistungen: false,
            hatKeinEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
        },
        {
          route: Route.ElternteilZweiAllgemeineAngaben,
          payload: { wirdZweitePersonBeruecksichtigt: true, name: "Max" },
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
            hatKeinEinkommen: true,
          },
          dependentValues: {
            istPersonAlleinerziehend: false,
          },
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
      it("returns Finanzdaten without Bruttoeinkommen if only hatKeinEinkommen equals true", () => {
        const finanzdaten = erstelleFinanzDaten(
          [
            {
              route: Route.ElternteilTaetigkeitenAbfrage,
              params: { elternteilIndex: 0 },
              payload: {
                istNichtSelbststaendig: false,
                istSelbststaendig: false,
                istVerbeamtet: false,
                hatAndereLeistungen: false,
                hatKeinEinkommen: true,
              },
              dependentValues: {
                istPersonAlleinerziehend: false,
              },
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
              hatKeinEinkommen: true,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
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
            dependentValues: {
              istMischeinkunft: false,
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

      it("throws a descriptive error when sozialversicherungen event is missing", () => {
        const events: FormEvent[] = [
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: true,
              istSelbststaendig: false,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: { istPersonAlleinerziehend: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
          },
        ];

        expect(() => erstelleFinanzDaten(events, 0)).toThrow(
          "No Sozialversicherungen event found for elternteil 0, taetigkeitIndex 0.",
        );
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
            dependentValues: {
              istPersonAlleinerziehend: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
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
            dependentValues: { istMischeinkunft: false },
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
              hatKeinEinkommen: true,
              istSelbststaendig: true,
              istNichtSelbststaendig: false,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
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

      it("takes 0 as income if bruttoEinkommen is negative", () => {
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
            dependentValues: {
              istPersonAlleinerziehend: false,
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
              bruttoJahresgewinn: -60000,
            },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(0),
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

    describe("Nicht-selbstständig mit variablem Monatseinkommen und Minijob", () => {
      it("aggregates average brutto across all months from both activities", () => {
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
            dependentValues: { istPersonAlleinerziehend: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
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
            dependentValues: { istMischeinkunft: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 400 },
            dependentValues: { istMischeinkunft: false },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(2650),
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

    describe("Mischeinkünfte", () => {
      it("produces mischEinkommenTaetigkeiten, selbstständig is index 0, nicht-selbstständig is index 1", () => {
        const events: FormEvent[] = [
          {
            route: Route.ElternteilTaetigkeitenAbfrage,
            params: { elternteilIndex: 0 },
            payload: {
              hatKeinEinkommen: true,
              istSelbststaendig: true,
              istNichtSelbststaendig: true,
              istVerbeamtet: false,
              hatAndereLeistungen: false,
            },
            dependentValues: {
              istPersonAlleinerziehend: false,
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
            dependentValues: { istMischeinkunft: true },
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

    describe("Nicht-selbstständig mit Minijob", () => {
      it("aggregates brutto from Angestelltentätigkeit and Minijob into bruttoEinkommen", () => {
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
            dependentValues: { istPersonAlleinerziehend: false },
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
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
            dependentValues: { istMischeinkunft: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: true },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 400 },
            dependentValues: { istMischeinkunft: false },
          },
        ];

        const finanzdaten = erstelleFinanzDaten(events, 0);

        expect(finanzdaten).toEqual({
          bruttoEinkommen: new Einkommen(3400),
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
            dependentValues: {
              istPersonAlleinerziehend: false,
            },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 0 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: false },
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
            dependentValues: { istMischeinkunft: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 1 },
            payload: { durchschnittlichesMonatsbrutto: 4000 },
            dependentValues: { istMischeinkunft: false },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig,
            params: { elternteilIndex: 0, taetigkeitIndex: 2 },
            payload: { istTaetigkeitMinijob: false },
            dependentValues: { kannDurchschnittAngegebenWerden: true },
          },
          {
            route: Route.ElternteilTaetigkeitAngabenEinkommen,
            params: { elternteilIndex: 0, taetigkeitIndex: 2 },
            payload: { durchschnittlichesMonatsbrutto: 3000 },
            dependentValues: { istMischeinkunft: false },
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
            dependentValues: {
              istPersonAlleinerziehend: false,
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
