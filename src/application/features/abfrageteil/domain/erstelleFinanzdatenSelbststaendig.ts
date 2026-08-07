import { FormEvent, Route } from "@/application/routing";
import {
  Einkommen,
  FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import { findeLetztesGueltigesEvent } from "../events/projections";

export function erstelleFinanzdatenSelbststaendig(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const ersteSelbststaendigeTaetigkeit = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenSelbststaendigAngaben,
    { elternteilIndex, selbststaendigIndex: 0 },
  );

  return {
    bruttoEinkommen: new Einkommen(
      berechneGesamtMonatsbruttoSelbststaendig(events, elternteilIndex),
    ),
    istKirchensteuerpflichtig:
      ersteSelbststaendigeTaetigkeit?.istKirchensteuerpflichtig,
    steuerklasse: Steuerklasse.I,
    kassenArt:
      ersteSelbststaendigeTaetigkeit?.istGesetzlichKrankenpflichtversichert
        ? KassenArt.GESETZLICH_PFLICHTVERSICHERT
        : KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung:
      ersteSelbststaendigeTaetigkeit?.istGesetzlichRentenversichert
        ? RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG
        : RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

function berechneGesamtMonatsbruttoSelbststaendig(
  events: FormEvent[],
  elternteilIndex: number,
): number {
  const selbststaendigIndizes = new Set(
    events
      .filter(
        (event): event is SelbststaendigEvent =>
          event.route === Route.ElternteilTaetigkeitenSelbststaendigAngaben &&
          event.params.elternteilIndex === elternteilIndex,
      )
      .map((event) => event.params.selbststaendigIndex),
  );

  return [...selbststaendigIndizes].reduce((summe, selbststaendigIndex) => {
    const bruttoJahresgewinn = findeBruttoJahresgewinn(
      events,
      elternteilIndex,
      selbststaendigIndex,
    );

    return summe + Math.max(bruttoJahresgewinn / 12, 0);
  }, 0);
}

function findeBruttoJahresgewinn(
  events: FormEvent[],
  elternteilIndex: number,
  selbststaendigIndex: number,
): number {
  const selbststaendigAngabenEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenSelbststaendigAngaben,
    { elternteilIndex, selbststaendigIndex },
  );

  return selbststaendigAngabenEvent?.bruttoJahresgewinn ?? 0;
}

type SelbststaendigEvent = Extract<
  FormEvent,
  { route: Route.ElternteilTaetigkeitenSelbststaendigAngaben }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzdatenSelbststaendig", () => {
    const erstelleAngabenEvent = (
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
        istGesetzlichKrankenpflichtversichert: true,
        istGesetzlichRentenversichert: true,
        istGesetzlichArbeitlosenversichert: true,
        bruttoJahresgewinn,
        ...overrides,
      },
    });

    it("berechnet bruttoEinkommen als 0, wenn keine Angaben-Events existieren", () => {
      const result = erstelleFinanzdatenSelbststaendig([], 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(0));
      expect(result.istKirchensteuerpflichtig).toBeUndefined();
      expect(result.kassenArt).toBe(
        KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      );
      expect(result.rentenVersicherung).toBe(
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("berechnet bruttoEinkommen aus dem Brutto-Jahresgewinn geteilt durch 12", () => {
      const events = [erstelleAngabenEvent(0, 0, 24000)];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(2000));
    });

    it("begrenzt bruttoEinkommen pro Tätigkeit auf mindestens 0 bei Verlust", () => {
      const events = [erstelleAngabenEvent(0, 0, -60000)];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(0));
    });

    it("summiert bruttoEinkommen aus mehreren selbstständigen Tätigkeiten", () => {
      const events = [
        erstelleAngabenEvent(0, 0, 24000),
        erstelleAngabenEvent(0, 1, 12000),
      ];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3000));
    });

    it("beruecksichtigt neu eingegebene Angaben für denselben selbststaendigIndex nur einmal, mit dem aktuellsten Wert", () => {
      const events = [
        erstelleAngabenEvent(0, 0, 24000),
        erstelleAngabenEvent(0, 0, 36000),
      ];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3000));
    });

    it("ignoriert Angaben-Events des anderen Elternteils", () => {
      const events = [
        erstelleAngabenEvent(0, 0, 24000),
        erstelleAngabenEvent(1, 0, 60000),
      ];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(2000));
    });

    it("holt sich die Sozialversicherungen-Felder von der ersten selbstständigen Tätigkeit", () => {
      const events = [
        erstelleAngabenEvent(0, 0, 24000, {
          istKirchensteuerpflichtig: true,
          istGesetzlichKrankenpflichtversichert: false,
          istGesetzlichRentenversichert: false,
        }),
        erstelleAngabenEvent(0, 1, 12000, {
          istKirchensteuerpflichtig: false,
          istGesetzlichKrankenpflichtversichert: true,
          istGesetzlichRentenversichert: true,
        }),
      ];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.istKirchensteuerpflichtig).toBe(true);
      expect(result.kassenArt).toBe(
        KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      );
      expect(result.rentenVersicherung).toBe(
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("setzt steuerklasse immer auf Steuerklasse.I", () => {
      const events = [erstelleAngabenEvent(0, 0, 24000)];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.steuerklasse).toBe(Steuerklasse.I);
    });

    it("setzt die statischen FinanzDaten-Felder", () => {
      const events = [erstelleAngabenEvent(0, 0, 24000)];

      const result = erstelleFinanzdatenSelbststaendig(events, 0);

      expect(result.splittingFaktor).toBe(1);
      expect(result.mischEinkommenTaetigkeiten).toEqual([]);
      expect(result.erwerbsZeitraumLebensMonatList).toEqual([]);
    });
  });
}
