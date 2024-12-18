import { ElternGeldArt } from "./eltern-geld-art";
import { MutterschaftsLeistung } from "./mutterschafts-leistung";

/**
 * Anzahl der Lebensmonate, die im Planer dargestellt werden.
 */
export const PLANUNG_ANZAHL_MONATE: number = 32;

export class PlanungsDaten {
  /**
   * Gibt an, ob und wie lange Mutterschafstleistungen bezogen werden.
   */
  mutterschaftsLeistung: MutterschaftsLeistung;

  /**
   * Liste der Elterngeldmonate für die Planung (unveränderliche Länge: Anzahl der Monate, die im Planer dargestellt
   * werden
   */
  planung: ElternGeldArt[];

  constructor(mutterschaftsLeistung: MutterschaftsLeistung) {
    this.mutterschaftsLeistung = mutterschaftsLeistung;
    this.planung = PlanungsDaten.createEmptyPlanung();
  }

  /**
   * Gibt die Elterngeldart für einen anhand des Index spezifizierten Monats zurück.
   *
   * @param {number} lebensMonat Lebensmonat des Kindes (nicht Index!!!)
   * @return {ElternGeldArt} ElterngeldArt des abgefragten Monats
   */
  public get(lebensMonat: number): ElternGeldArt {
    const index: number = lebensMonat - 1;
    if (lebensMonat > PLANUNG_ANZAHL_MONATE) {
      return ElternGeldArt.KEIN_BEZUG;
    }
    return this.planung[index];
  }

  // public getPlanungBezugsarten(): Array<de.init.anton.plugins.egr.fwl.ElterngeldArt> {
  //   const result: Array<de.init.anton.plugins.egr.fwl.ElterngeldArt> = <any>([]);
  //   {
  //     let array = this.getPlanung();
  //     for (let index = 0; index < array.length; index++) {
  //       let monat = array[index];
  //       {
  //         /* add */
  //         (result.push(monat.getElterngeldArt()) > 0);
  //       }
  //     }
  //   }
  //   return result;
  // }

  private static createEmptyPlanung() {
    const planungList: ElternGeldArt[] = [];
    for (let i = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      planungList[i] = ElternGeldArt.KEIN_BEZUG;
    }
    return planungList;
  }
}

export function planungsDatenOf(source: PlanungsDaten) {
  const copy = new PlanungsDaten(source.mutterschaftsLeistung);
  copy.planung = source.planung;
  Object.assign(copy, source);
  return copy;
}
