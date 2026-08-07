import { FormEvent, Route } from "@/application/routing";
import {
  Einkommen,
  ErwerbsTaetigkeit,
  FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import { findeSozialversicherungen } from "./findeSozialversicherungenNew";
import { findeLetztesGueltigesEvent } from "../events/projections";
import type { MischEkTaetigkeit } from "@/elterngeldrechner/model/misch-ek-taetigkeit";
import { findeTaetigkeiten } from "./findeTaetigkeiten";
import { ElternteilTaetigkeitenAbfrage } from "../pages/elternteil";
import { findeMonatsbruttoMinijob } from "./erstelleFinanzdatenMinijob";
import { findeMonatsbruttoAngestellt } from "./erstelleFinanzdatenAngestellt";
import { berechneDurchschnittMonatsbruttoProAktivemMonat } from "./durchschnittMonatsbrutto";

export function erstelleFinanzdatenMischeinkunft(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const taetigkeiten = findeTaetigkeiten(events, elternteilIndex);
  const sozialversicherungen =
    taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet
      ? findeSozialversicherungen(events, elternteilIndex)
      : undefined;

  return {
    bruttoEinkommen: new Einkommen(0),
    istKirchensteuerpflichtig:
      sozialversicherungen?.istKirchensteuerpflichtig ?? false,
    steuerklasse: sozialversicherungen?.steuerklasse ?? Steuerklasse.I,
    kassenArt: sozialversicherungen?.istGesetzlichKrankenpflichtversichert
      ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
      : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: sozialversicherungen?.istGesetzlichRentenversichert
      ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
      : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: erstelleMischEinkommenTaetigkeiten(
      events,
      elternteilIndex,
      taetigkeiten,
    ),
    erwerbsZeitraumLebensMonatList: [],
  };
}

function erstelleMischEinkommenTaetigkeiten(
  events: FormEvent[],
  elternteilIndex: number,
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
): MischEkTaetigkeit[] {
  const angestelltTaetigkeiten =
    taetigkeiten.istNichtSelbststaendig || taetigkeiten.istVerbeamtet
      ? erstelleAngestelltTaetigkeitenFuerMischEinkommen(
          events,
          elternteilIndex,
        )
      : [];

  const minijobTaetigkeiten =
    taetigkeiten.hatMinijob === true
      ? erstelleMinijobTaetigkeitenFuerMischEinkommen(events, elternteilIndex)
      : [];

  const selbststaendigTaetigkeiten = taetigkeiten.istSelbststaendig
    ? erstelleSelbststaendigTaetigkeitenFuerMischEinkommen(
        events,
        elternteilIndex,
      )
    : [];

  return [
    ...angestelltTaetigkeiten,
    ...minijobTaetigkeiten,
    ...selbststaendigTaetigkeiten,
  ].filter((taetigkeit) => taetigkeit.bemessungsZeitraumMonate.some(Boolean));
}

function erstelleAngestelltTaetigkeitenFuerMischEinkommen(
  events: FormEvent[],
  elternteilIndex: number,
): MischEkTaetigkeit[] {
  const angestelltIndizes = new Set(
    events
      .filter(
        (event): event is AngestelltEinkommenEvent =>
          (event.route === Route.ElternteilTaetigkeitenAngestelltEinkommen ||
            event.route ===
              Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert) &&
          event.params.elternteilIndex === elternteilIndex,
      )
      .map((event) => event.params.angestelltIndex),
  );

  const monatsbrutto = [...angestelltIndizes].reduce(
    (summe, angestelltIndex) => {
      const monatsbruttoEinerAngestelltenTaetigkeit =
        findeMonatsbruttoAngestellt(events, elternteilIndex, angestelltIndex);

      return summe.map(
        (wert, monat) =>
          wert + (monatsbruttoEinerAngestelltenTaetigkeit[monat] ?? 0),
      );
    },
    new Array<number>(12).fill(0),
  );

  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
  );

  return [
    {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
      bruttoEinkommenDurchschnitt:
        berechneDurchschnittMonatsbruttoProAktivemMonat(monatsbrutto),
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: monatsbrutto.map((brutto) => brutto > 0),
      istRentenVersicherungsPflichtig:
        sozialversicherungen.istGesetzlichRentenversichert,
      istKrankenVersicherungsPflichtig:
        sozialversicherungen.istGesetzlichKrankenpflichtversichert,
      istArbeitslosenVersicherungsPflichtig:
        sozialversicherungen.istGesetzlichArbeitlosenversichert,
    },
  ];
}

function erstelleMinijobTaetigkeitenFuerMischEinkommen(
  events: FormEvent[],
  elternteilIndex: number,
): MischEkTaetigkeit[] {
  const minijobIndizes = new Set(
    events
      .filter(
        (event): event is MinijobEinkommenEvent =>
          (event.route === Route.ElternteilTaetigkeitenMinijobEinkommen ||
            event.route ===
              Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert) &&
          event.params.elternteilIndex === elternteilIndex,
      )
      .map((event) => event.params.minijobIndex),
  );

  const monatsbrutto = [...minijobIndizes].reduce((summe, minijobIndex) => {
    const monatsbruttoEinesMinijobs = findeMonatsbruttoMinijob(
      events,
      elternteilIndex,
      minijobIndex,
    );

    return summe.map(
      (wert, monat) => wert + (monatsbruttoEinesMinijobs[monat] ?? 0),
    );
  }, new Array<number>(12).fill(0));

  return [
    {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.MINIJOB,
      bruttoEinkommenDurchschnitt:
        berechneDurchschnittMonatsbruttoProAktivemMonat(monatsbrutto),
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: monatsbrutto.map((brutto) => brutto > 0),
      istRentenVersicherungsPflichtig: false,
      istKrankenVersicherungsPflichtig: false,
      istArbeitslosenVersicherungsPflichtig: false,
    },
  ];
}

function erstelleSelbststaendigTaetigkeitenFuerMischEinkommen(
  events: FormEvent[],
  elternteilIndex: number,
): MischEkTaetigkeit[] {
  const selbststaendigIndizes = new Set(
    events
      .filter(
        (event): event is SelbststaendigEvent =>
          event.route === Route.ElternteilTaetigkeitenSelbststaendigAngaben &&
          event.params.elternteilIndex === elternteilIndex,
      )
      .map((event) => event.params.selbststaendigIndex),
  );

  return [...selbststaendigIndizes].map((selbststaendigIndex) => {
    const relevantesEvent = findeLetztesGueltigesEvent(
      events,
      Route.ElternteilTaetigkeitenSelbststaendigAngaben,
      { elternteilIndex, selbststaendigIndex },
    );

    return {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
      bruttoEinkommenDurchschnitt: Math.max(
        (relevantesEvent?.bruttoJahresgewinn ?? 0) / 12,
        0,
      ),
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: new Array<boolean>(12).fill(true),
      istRentenVersicherungsPflichtig:
        relevantesEvent?.istGesetzlichRentenversichert ?? false,
      istKrankenVersicherungsPflichtig:
        relevantesEvent?.istGesetzlichKrankenpflichtversichert ?? false,
      istArbeitslosenVersicherungsPflichtig:
        relevantesEvent?.istGesetzlichArbeitlosenversichert ?? false,
    };
  });
}

type AngestelltEinkommenEvent = Extract<
  FormEvent,
  {
    route:
      | Route.ElternteilTaetigkeitenAngestelltEinkommen
      | Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert;
  }
>;

type MinijobEinkommenEvent = Extract<
  FormEvent,
  {
    route:
      | Route.ElternteilTaetigkeitenMinijobEinkommen
      | Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert;
  }
>;

type SelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitenSelbststaendigAngaben }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzdatenMischeinkunft", () => {
    const erstelleAbfrageEvent = (
      elternteilIndex: number,
      overrides: Partial<{
        istNichtSelbststaendig: boolean;
        istSelbststaendig: boolean;
        istVerbeamtet: boolean;
        hatMinijob: boolean;
      }>,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAbfrage,
      params: { elternteilIndex },
      payload: {
        istNichtSelbststaendig: false,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
        hatPeriodenOhneEinkommen: false,
        ...overrides,
      },
      dependentValues: {
        istPersonAlleinerziehend: false,
        wirdZweitePersonBeruecksichtigt: false,
      },
    });

    const erstelleHauptjobEvent = (
      elternteilIndex: number,
      overrides: Partial<{
        istKirchensteuerpflichtig: boolean;
        istGesetzlichKrankenpflichtversichert: boolean;
        istGesetzlichRentenversichert: boolean;
        istGesetzlichArbeitlosenversichert: boolean;
      }> = {},
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltHauptjob,
      params: { elternteilIndex, angestelltIndex: 0 },
      payload: {
        steuerklasse: Steuerklasse.I,
        istKirchensteuerpflichtig: false,
        istGesetzlichKrankenpflichtversichert: true,
        istGesetzlichRentenversichert: true,
        istGesetzlichArbeitlosenversichert: true,
        ...overrides,
      },
      dependentValues: { kannDurchschnittAngegebenWerden: true },
    });

    const erstelleAngestelltEinkommenEvent = (
      elternteilIndex: number,
      angestelltIndex: number,
      durchschnittlichesMonatsbrutto: number,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltEinkommen,
      params: { elternteilIndex, angestelltIndex },
      payload: { durchschnittlichesMonatsbrutto },
    });

    const erstelleAngestelltEinkommenDetailliertEvent = (
      elternteilIndex: number,
      angestelltIndex: number,
      monatsbrutto: number[],
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert,
      params: { elternteilIndex, angestelltIndex },
      payload: { monatsbrutto },
    });

    const erstelleMinijobEinkommenEvent = (
      elternteilIndex: number,
      minijobIndex: number,
      durchschnittlichesMonatsbrutto: number,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenMinijobEinkommen,
      params: { elternteilIndex, minijobIndex },
      payload: { durchschnittlichesMonatsbrutto },
    });

    const erstelleSelbststaendigAngabenEvent = (
      elternteilIndex: number,
      selbststaendigIndex: number,
      bruttoJahresgewinn: number,
      overrides: Partial<{
        istKirchensteuerpflichtig: boolean;
        istGesetzlichKrankenpflichtversichert: boolean;
        istGesetzlichRentenversichert: boolean;
        istGesetzlichArbeitlosenversichert: boolean;
      }> = {},
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenSelbststaendigAngaben,
      params: { elternteilIndex, selbststaendigIndex },
      payload: {
        istKirchensteuerpflichtig: false,
        istGesetzlichKrankenpflichtversichert: false,
        istGesetzlichRentenversichert: false,
        istGesetzlichArbeitlosenversichert: false,
        bruttoJahresgewinn,
        ...overrides,
      },
    });

    it("kombiniert Angestellt und Minijob zu getrennten mischEinkommenTaetigkeiten-Einträgen", () => {
      const events = [
        erstelleAbfrageEvent(0, {
          istNichtSelbststaendig: true,
          hatMinijob: true,
        }),
        erstelleHauptjobEvent(0),
        erstelleAngestelltEinkommenEvent(0, 0, 3000),
        erstelleMinijobEinkommenEvent(0, 0, 450),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten.map((t) => t.erwerbsTaetigkeit),
      ).toEqual([
        ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
        ErwerbsTaetigkeit.MINIJOB,
      ]);
    });

    it("summiert mehrere Angestellt-Tätigkeiten zu einem einzigen NICHT_SELBSTSTAENDIG-Eintrag", () => {
      const events = [
        erstelleAbfrageEvent(0, { istNichtSelbststaendig: true }),
        erstelleHauptjobEvent(0),
        erstelleAngestelltEinkommenEvent(0, 0, 2000),
        erstelleAngestelltEinkommenEvent(0, 1, 800),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.mischEinkommenTaetigkeiten).toHaveLength(1);
      expect(
        result.mischEinkommenTaetigkeiten[0]?.bruttoEinkommenDurchschnitt,
      ).toBe(2800);
    });

    it("summiert mehrere Minijobs zu einem einzigen MINIJOB-Eintrag", () => {
      const events = [
        erstelleAbfrageEvent(0, { hatMinijob: true }),
        erstelleMinijobEinkommenEvent(0, 0, 300),
        erstelleMinijobEinkommenEvent(0, 1, 200),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.mischEinkommenTaetigkeiten).toHaveLength(1);
      expect(
        result.mischEinkommenTaetigkeiten[0]?.bruttoEinkommenDurchschnitt,
      ).toBe(500);
    });

    it("erstellt für jede selbstständige Tätigkeit einen eigenen Eintrag", () => {
      const events = [
        erstelleAbfrageEvent(0, { istSelbststaendig: true }),
        erstelleSelbststaendigAngabenEvent(0, 0, 24000),
        erstelleSelbststaendigAngabenEvent(0, 1, 12000),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.mischEinkommenTaetigkeiten).toHaveLength(2);
      expect(
        result.mischEinkommenTaetigkeiten.map(
          (t) => t.bruttoEinkommenDurchschnitt,
        ),
      ).toEqual([2000, 1000]);
    });

    it("berechnet bruttoEinkommenDurchschnitt für Angestellt als Durchschnitt über aktive Monate", () => {
      const events = [
        erstelleAbfrageEvent(0, { istNichtSelbststaendig: true }),
        erstelleHauptjobEvent(0),
        erstelleAngestelltEinkommenDetailliertEvent(
          0,
          0,
          [3000, 3000, 3000, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten[0]?.bruttoEinkommenDurchschnitt,
      ).toBe(3000);
      expect(
        result.mischEinkommenTaetigkeiten[0]?.bemessungsZeitraumMonate,
      ).toEqual([
        true,
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });

    it("filtert Tätigkeiten ohne aktive Monate heraus", () => {
      const events = [
        erstelleAbfrageEvent(0, {
          istNichtSelbststaendig: true,
          hatMinijob: true,
        }),
        erstelleHauptjobEvent(0),
        erstelleAngestelltEinkommenEvent(0, 0, 3000),
        erstelleMinijobEinkommenEvent(0, 0, 0),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten.map((t) => t.erwerbsTaetigkeit),
      ).toEqual([ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG]);
    });

    it("holt die Sozialversicherungen-Felder für den NICHT_SELBSTSTAENDIG-Eintrag vom Hauptjob", () => {
      const events = [
        erstelleAbfrageEvent(0, { istNichtSelbststaendig: true }),
        erstelleHauptjobEvent(0, {
          istGesetzlichRentenversichert: false,
          istGesetzlichKrankenpflichtversichert: false,
          istGesetzlichArbeitlosenversichert: false,
        }),
        erstelleAngestelltEinkommenEvent(0, 0, 3000),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten[0]?.istRentenVersicherungsPflichtig,
      ).toBe(false);
      expect(
        result.mischEinkommenTaetigkeiten[0]?.istKrankenVersicherungsPflichtig,
      ).toBe(false);
      expect(
        result.mischEinkommenTaetigkeiten[0]
          ?.istArbeitslosenVersicherungsPflichtig,
      ).toBe(false);
    });

    it("setzt die Sozialversicherungen-Felder für den MINIJOB-Eintrag immer auf false", () => {
      const events = [
        erstelleAbfrageEvent(0, { hatMinijob: true }),
        erstelleMinijobEinkommenEvent(0, 0, 450),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten[0]?.istRentenVersicherungsPflichtig,
      ).toBe(false);
      expect(
        result.mischEinkommenTaetigkeiten[0]?.istKrankenVersicherungsPflichtig,
      ).toBe(false);
      expect(
        result.mischEinkommenTaetigkeiten[0]
          ?.istArbeitslosenVersicherungsPflichtig,
      ).toBe(false);
    });

    it("holt die Sozialversicherungen-Felder je selbstständige Tätigkeit einzeln", () => {
      const events = [
        erstelleAbfrageEvent(0, { istSelbststaendig: true }),
        erstelleSelbststaendigAngabenEvent(0, 0, 24000, {
          istGesetzlichRentenversichert: true,
        }),
        erstelleSelbststaendigAngabenEvent(0, 1, 12000, {
          istGesetzlichRentenversichert: false,
        }),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(
        result.mischEinkommenTaetigkeiten[0]?.istRentenVersicherungsPflichtig,
      ).toBe(true);
      expect(
        result.mischEinkommenTaetigkeiten[1]?.istRentenVersicherungsPflichtig,
      ).toBe(false);
    });

    it("holt die äußeren Sozialversicherungen-Felder auch für Verbeamtete vom Hauptjob", () => {
      const events = [
        erstelleAbfrageEvent(0, {
          istVerbeamtet: true,
          istSelbststaendig: true,
        }),
        erstelleHauptjobEvent(0, { istKirchensteuerpflichtig: true }),
        erstelleAngestelltEinkommenEvent(0, 0, 3000),
        erstelleSelbststaendigAngabenEvent(0, 0, 12000),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.istKirchensteuerpflichtig).toBe(true);
    });

    it("setzt die äußeren Sozialversicherungen-Felder auf ihre Default-Werte, wenn weder angestellt noch verbeamtet", () => {
      const events = [
        erstelleAbfrageEvent(0, {
          hatMinijob: true,
          istSelbststaendig: true,
        }),
        erstelleMinijobEinkommenEvent(0, 0, 450),
        erstelleSelbststaendigAngabenEvent(0, 0, 12000),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.istKirchensteuerpflichtig).toBe(false);
      expect(result.steuerklasse).toBe(Steuerklasse.I);
      expect(result.kassenArt).toBe(
        KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      );
      expect(result.rentenVersicherung).toBe(
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("setzt die statischen FinanzDaten-Felder", () => {
      const events = [
        erstelleAbfrageEvent(0, { hatMinijob: true }),
        erstelleMinijobEinkommenEvent(0, 0, 450),
      ];

      const result = erstelleFinanzdatenMischeinkunft(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(0));
      expect(result.splittingFaktor).toBe(1);
      expect(result.erwerbsZeitraumLebensMonatList).toEqual([]);
    });
  });
}
