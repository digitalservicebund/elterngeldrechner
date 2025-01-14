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
  planung: ElternGeldArt[] = [];

  constructor(mutterschaftsLeistung: MutterschaftsLeistung) {
    this.mutterschaftsLeistung = mutterschaftsLeistung;
  }

  /**
   * Gibt die Elterngeldart für einen anhand des Index spezifizierten Monats zurück.
   *
   * @param {number} lebensMonat Lebensmonat des Kindes (nicht Index!!!)
   * @return {ElternGeldArt} ElterngeldArt des abgefragten Monats
   */
  public get(lebensMonat: number): ElternGeldArt | undefined {
    const index: number = lebensMonat - 1;
    return this.planung[index];
  }
}

export function planungsDatenOf(source: PlanungsDaten) {
  const copy = new PlanungsDaten(source.mutterschaftsLeistung);
  copy.planung = source.planung;
  Object.assign(copy, source);
  return copy;
}
