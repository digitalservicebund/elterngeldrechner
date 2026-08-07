import { FormEvent, Route } from "@/application/routing";
import {
  Einkommen,
  FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import { findeSozialversicherungen } from "./findeSozialversicherungenNew";
import { durchschnittMonatsbrutto } from "./durchschnittMonatsbrutto";
import { findeLetztesGueltigesEvent } from "../events/projections";

export function erstelleFinanzdatenAngestellt(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  const sozialversicherungen = findeSozialversicherungen(
    events,
    elternteilIndex,
  );

  return {
    bruttoEinkommen: new Einkommen(
      berechneDurchschnittlichesBruttoeinkommenAngestellt(
        events,
        elternteilIndex,
      ),
    ),
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

export function findeMonatsbruttoAngestellt(
  events: FormEvent[],
  elternteilIndex: number,
  angestelltIndex: number,
): number[] {
  const durchschnittlichesEinkommenEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenAngestelltEinkommen,
    { elternteilIndex, angestelltIndex },
  );

  if (durchschnittlichesEinkommenEvent) {
    return new Array<number>(12).fill(
      durchschnittlichesEinkommenEvent.durchschnittlichesMonatsbrutto,
    );
  }

  const detailliertesEinkommenEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert,
    { elternteilIndex, angestelltIndex },
  );

  return (
    detailliertesEinkommenEvent?.monatsbrutto ?? new Array<number>(12).fill(0)
  );
}

function berechneDurchschnittlichesBruttoeinkommenAngestellt(
  events: FormEvent[],
  elternteilIndex: number,
): number {
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

  return [...angestelltIndizes].reduce((summe, angestelltIndex) => {
    const monatsbrutto = findeMonatsbruttoAngestellt(
      events,
      elternteilIndex,
      angestelltIndex,
    );

    return summe + durchschnittMonatsbrutto(monatsbrutto);
  }, 0);
}

type AngestelltEinkommenEvent = Extract<
  FormEvent,
  {
    route:
      | Route.ElternteilTaetigkeitenAngestelltEinkommen
      | Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert;
  }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzdatenAngestellt", () => {
    const erstelleHauptjobEvent = (
      elternteilIndex: number,
      overrides: Partial<{
        steuerklasse: Steuerklasse;
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

    const erstelleEinkommenEvent = (
      elternteilIndex: number,
      angestelltIndex: number,
      durchschnittlichesMonatsbrutto: number,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltEinkommen,
      params: { elternteilIndex, angestelltIndex },
      payload: { durchschnittlichesMonatsbrutto },
    });

    const erstelleEinkommenDetailliertEvent = (
      elternteilIndex: number,
      angestelltIndex: number,
      monatsbrutto: number[],
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenAngestelltEinkommenDetailliert,
      params: { elternteilIndex, angestelltIndex },
      payload: { monatsbrutto },
    });

    it("throws wenn kein Hauptjob event existiert", () => {
      expect(() => erstelleFinanzdatenAngestellt([], 0)).toThrow();
    });

    it("berechnet bruttoEinkommen aus einem durchschnittlichen Einkommen", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenEvent(0, 0, 3000),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3000));
    });

    it("berechnet bruttoEinkommen als 12-Monats-Durchschnitt eines detaillierten Einkommens", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenDetailliertEvent(
          0,
          0,
          [
            2000, 2000, 2000, 2000, 2000, 2000, 4000, 4000, 4000, 4000, 4000,
            4000,
          ],
        ),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3000));
    });

    it("summiert bruttoEinkommen aus Hauptjob und Nebenjob", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenEvent(0, 0, 2000),
        erstelleEinkommenEvent(0, 1, 800),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(2800));
    });

    it("beruecksichtigt neu eingegebenes Einkommen für denselben angestelltIndex nur einmal, mit dem aktuellsten Wert", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenEvent(0, 0, 3000),
        erstelleEinkommenEvent(0, 0, 3500),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3500));
    });

    it("ignoriert Einkommen-Events des anderen Elternteils", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenEvent(0, 0, 3000),
        erstelleHauptjobEvent(1),
        erstelleEinkommenEvent(1, 0, 5000),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(3000));
    });

    it("holt sich die Sozialversicherungen-Felder vom Hauptjob-Event", () => {
      const events = [
        erstelleHauptjobEvent(0, {
          steuerklasse: Steuerklasse.III,
          istKirchensteuerpflichtig: true,
          istGesetzlichKrankenpflichtversichert: false,
          istGesetzlichRentenversichert: false,
          istGesetzlichArbeitlosenversichert: false,
        }),
        erstelleEinkommenEvent(0, 0, 1000),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.istKirchensteuerpflichtig).toBe(true);
      expect(result.steuerklasse).toBe(Steuerklasse.III);
      expect(result.kassenArt).toBe(
        KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
      );
      expect(result.rentenVersicherung).toBe(
        RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
      );
    });

    it("setzt die statischen FinanzDaten-Felder", () => {
      const events = [
        erstelleHauptjobEvent(0),
        erstelleEinkommenEvent(0, 0, 1000),
      ];

      const result = erstelleFinanzdatenAngestellt(events, 0);

      expect(result.splittingFaktor).toBe(1);
      expect(result.mischEinkommenTaetigkeiten).toEqual([]);
      expect(result.erwerbsZeitraumLebensMonatList).toEqual([]);
    });
  });
}
