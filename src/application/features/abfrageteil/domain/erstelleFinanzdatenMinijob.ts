import { FormEvent, Route } from "@/application/routing";
import {
  Einkommen,
  FinanzDaten,
  KassenArt,
  RentenArt,
  Steuerklasse,
} from "@/elterngeldrechner";
import { durchschnittMonatsbrutto } from "./durchschnittMonatsbrutto";
import { findeLetztesGueltigesEvent } from "../events/projections";

export function erstelleFinanzdatenMinijob(
  events: FormEvent[],
  elternteilIndex: number,
): Omit<FinanzDaten, "kinderFreiBetrag"> {
  return {
    bruttoEinkommen: new Einkommen(
      berechneDurchschnittlichesBruttoeinkommenMinijob(events, elternteilIndex),
    ),
    istKirchensteuerpflichtig: false,
    steuerklasse: Steuerklasse.I,
    kassenArt: KassenArt.NICHT_GESETZLICH_PFLICHTVERSICHERT,
    rentenVersicherung: RentenArt.KEINE_GESETZLICHE_RENTEN_VERSICHERUNG,
    splittingFaktor: 1,
    mischEinkommenTaetigkeiten: [],
    erwerbsZeitraumLebensMonatList: [],
  };
}

export function findeMonatsbruttoMinijob(
  events: FormEvent[],
  elternteilIndex: number,
  minijobIndex: number,
): number[] {
  const durchschnittlichesEinkommenEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenMinijobEinkommen,
    { elternteilIndex, minijobIndex },
  );

  if (durchschnittlichesEinkommenEvent) {
    return new Array<number>(12).fill(
      durchschnittlichesEinkommenEvent.durchschnittlichesMonatsbrutto,
    );
  }

  const detailliertesEinkommenEvent = findeLetztesGueltigesEvent(
    events,
    Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert,
    { elternteilIndex, minijobIndex },
  );

  return (
    detailliertesEinkommenEvent?.monatsbrutto ?? new Array<number>(12).fill(0)
  );
}

function berechneDurchschnittlichesBruttoeinkommenMinijob(
  events: FormEvent[],
  elternteilIndex: number,
): number {
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

  return [...minijobIndizes].reduce((summe, minijobIndex) => {
    const monatsbrutto = findeMonatsbruttoMinijob(
      events,
      elternteilIndex,
      minijobIndex,
    );

    return summe + durchschnittMonatsbrutto(monatsbrutto);
  }, 0);
}

type MinijobEinkommenEvent = Extract<
  FormEvent,
  {
    route:
      | Route.ElternteilTaetigkeitenMinijobEinkommen
      | Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert;
  }
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleFinanzdatenMinijob", () => {
    const erstelleEinkommenEvent = (
      elternteilIndex: number,
      minijobIndex: number,
      durchschnittlichesMonatsbrutto: number,
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenMinijobEinkommen,
      params: { elternteilIndex, minijobIndex },
      payload: { durchschnittlichesMonatsbrutto },
    });

    const erstelleEinkommenDetailliertEvent = (
      elternteilIndex: number,
      minijobIndex: number,
      monatsbrutto: number[],
    ): FormEvent => ({
      route: Route.ElternteilTaetigkeitenMinijobEinkommenDetailliert,
      params: { elternteilIndex, minijobIndex },
      payload: { monatsbrutto },
    });

    it("berechnet bruttoEinkommen als 0, wenn keine Einkommen-Events existieren", () => {
      const result = erstelleFinanzdatenMinijob([], 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(0));
    });

    it("berechnet bruttoEinkommen aus einem durchschnittlichen Einkommen", () => {
      const events = [erstelleEinkommenEvent(0, 0, 450)];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(450));
    });

    it("berechnet bruttoEinkommen als 12-Monats-Durchschnitt eines detaillierten Einkommens", () => {
      const events = [
        erstelleEinkommenDetailliertEvent(
          0,
          0,
          [300, 300, 300, 300, 300, 300, 600, 600, 600, 600, 600, 600],
        ),
      ];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(450));
    });

    it("summiert bruttoEinkommen aus mehreren Minijobs", () => {
      const events = [
        erstelleEinkommenEvent(0, 0, 300),
        erstelleEinkommenEvent(0, 1, 200),
      ];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(500));
    });

    it("beruecksichtigt neu eingegebenes Einkommen für denselben minijobIndex nur einmal, mit dem aktuellsten Wert", () => {
      const events = [
        erstelleEinkommenEvent(0, 0, 300),
        erstelleEinkommenEvent(0, 0, 350),
      ];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(350));
    });

    it("ignoriert Einkommen-Events des anderen Elternteils", () => {
      const events = [
        erstelleEinkommenEvent(0, 0, 300),
        erstelleEinkommenEvent(1, 0, 500),
      ];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.bruttoEinkommen).toEqual(new Einkommen(300));
    });

    it("setzt feste Werte für Steuer und Sozialversicherung, da Minijobs steuer- und sozialabgabenfrei sind", () => {
      const events = [erstelleEinkommenEvent(0, 0, 450)];

      const result = erstelleFinanzdatenMinijob(events, 0);

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
      const events = [erstelleEinkommenEvent(0, 0, 450)];

      const result = erstelleFinanzdatenMinijob(events, 0);

      expect(result.splittingFaktor).toBe(1);
      expect(result.mischEinkommenTaetigkeiten).toEqual([]);
      expect(result.erwerbsZeitraumLebensMonatList).toEqual([]);
    });
  });
}
