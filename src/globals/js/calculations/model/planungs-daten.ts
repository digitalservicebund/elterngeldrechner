import { ElternGeldArt } from "./eltern-geld-art";
import { MutterschaftsLeistung } from "./mutterschafts-leistung";

/**
 * Anzahl der Lebensmonate, die im Planer dargestellt werden.
 */
export const PLANUNG_ANZAHL_MONATE: number = 32;

export class PlanungsDaten {
  /**
   * Gibt an, ob der Partner alleinerziehend ist.
   */
  alleinerziehend: boolean;

  /**
   * Gibt an, ob der Partner vor der Geburt erwerbstätig ist.
   */
  erwerbsStatus: boolean;

  /**
   * Gibt an, ob der Partner die Voraussetzungen für den Partnerbonus erfällt.
   */
  partnerBonus: boolean;

  /**
   * Gibt an, ob und wie lange Mutterschafstleistungen bezogen werden.
   */
  mutterschaftsLeistung: MutterschaftsLeistung;

  /**
   * Liste der Elterngeldmonate für die Planung (unveränderliche Länge: Anzahl der Monate, die im Planer dargestellt
   * werden
   */
  planung: ElternGeldArt[];

  constructor(
    alleinerziehend: boolean,
    erwerbsStatus: boolean,
    partnerBonus: boolean,
    mutterschaftsLeistung: MutterschaftsLeistung,
  ) {
    this.alleinerziehend = alleinerziehend;
    this.erwerbsStatus = erwerbsStatus;
    this.partnerBonus = partnerBonus;
    this.mutterschaftsLeistung = mutterschaftsLeistung;
    this.planung = PlanungsDaten.createEmptyPlanung();
  }

  // public isAlleinerziehendJN(): boolean {
  //   return this.getAlleinerziehend() === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public isErwerbstaetigJN(): boolean {
  //   return this.getErwerbstatus() === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public isEmptyPlanung(): boolean {
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       if (monat.getElterngeldArt() !== de.init.anton.plugins.egr.fwl.ElterngeldArt.KEIN_BEZUG) {
  //         return false;
  //       }
  //     }
  //   }
  //   return true;
  // }
  //
  // public hasPartnerbonusJN(): boolean {
  //   return this.partnerbonus === de.init.anton.plugins.egr.fwl.YesNo.YES;
  // }
  //
  // public getPlanungIntList(): Array<number> {
  //   const intList: Array<number> = <any>([]);
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       /* add */
  //       (intList.push(de.init.anton.plugins.egr.fwl.ElterngeldArt["_$wrappers"][monat.getElterngeldArt()].getIndex()) > 0);
  //     }
  //   }
  //   return intList;
  // }
  //
  // /**
  //  * Planungswerte als String, Javascript FunktionalitÃ¤t greift hierauf zu.
  //  *
  //  * @return
  //  * @return {string}
  //  */
  // public getPlanungValues(): string {
  //   if (this.planung == null || /* isEmpty */(this.planung.length == 0)) {
  //     return this.createEmptyPlanung();
  //   }
  //   const sb: { str: string, toString: Function } = {
  //     str: "", toString: function () {
  //       return this.str;
  //     }
  //   };
  //   for (let index = 0; index < this.planung.length; index++) {
  //     let monat = this.planung[index];
  //     {
  //       /* append */
  //       (sb => {
  //         sb.str += <any>de.init.anton.plugins.egr.fwl.ElterngeldArt["_$wrappers"][monat.getElterngeldArt()].getIndex();
  //         return sb;
  //       })(sb);
  //       /* append */
  //       (sb => {
  //         sb.str += <any>",";
  //         return sb;
  //       })(sb);
  //     }
  //   }
  //   return this.cutLastComma(/* toString */sb.str);
  // }
  //
  // /*private*/
  // cutLastComma(values: string): string {
  //   if (values == null) {
  //     values = "";
  //   }
  //   if (/* endsWith */((str, searchString) => {
  //     let pos = str.length - searchString.length;
  //     let lastIndex = str.indexOf(searchString, pos);
  //     return lastIndex !== -1 && lastIndex === pos;
  //   })(values, ",") && values.length >= 2) {
  //     values = values.substring(0, values.length - 1);
  //   } else {
  //     values = /* replace */values.split(",").join("");
  //   }
  //   return values;
  // }
  //
  // public setPlanungValues$java_util_List(listPlanungIdx: Array<number>) {
  //   if (listPlanungIdx != null && !/* isEmpty */(listPlanungIdx.length == 0)) {
  //     let lebensMonat: number = 0;
  //     for (let index = 0; index < listPlanungIdx.length; index++) {
  //       let idx = listPlanungIdx[index];
  //       {
  //         if (idx >= 0 && idx <= 3) {
  //           this.set(++lebensMonat, /* Enum.values */function () {
  //             let result: de.init.anton.plugins.egr.fwl.ElterngeldArt[] = [];
  //             for (let val in de.init.anton.plugins.egr.fwl.ElterngeldArt) {
  //               if (!isNaN(<any>val)) {
  //                 result.push(parseInt(val, 10));
  //               }
  //             }
  //             return result;
  //           }()[idx]);
  //         } else {
  //         }
  //       }
  //     }
  //   }
  // }
  //
  // public setPlanungValues$java_lang_String(planungValues: string) {
  //   this.setPlanungValues$java_lang_String$java_lang_String(planungValues, ",");
  // }
  //
  // public setPlanungValues$java_lang_String$java_lang_String(planungValues: string, splitRegEx: string) {
  //   const planungValuesArray: string[] = planungValues.split(splitRegEx);
  //   if (planungValuesArray.length !== Planungsdaten.ANZAHL_MONATE) {
  //   }
  //   let lebensMonat: number = 0;
  //   for (let index = 0; index < planungValuesArray.length; index++) {
  //     let value = planungValuesArray[index];
  //     {
  //       const elterngeldIndex: number = /* parseInt */parseInt(value);
  //       if (elterngeldIndex >= 0 && elterngeldIndex <= 3) {
  //         this.set(++lebensMonat, /* Enum.values */function () {
  //           let result: de.init.anton.plugins.egr.fwl.ElterngeldArt[] = [];
  //           for (let val in de.init.anton.plugins.egr.fwl.ElterngeldArt) {
  //             if (!isNaN(<any>val)) {
  //               result.push(parseInt(val, 10));
  //             }
  //           }
  //           return result;
  //         }()[elterngeldIndex]);
  //       } else {
  //       }
  //     }
  //   }
  // }
  //
  // public setPlanungValues(planungValues?: any, splitRegEx?: any) {
  //   if (((typeof planungValues === 'string') || planungValues === null) && ((typeof splitRegEx === 'string') || splitRegEx === null)) {
  //     return <any>this.setPlanungValues$java_lang_String$java_lang_String(planungValues, splitRegEx);
  //   } else if (((planungValues != null && (planungValues instanceof Array)) || planungValues === null) && splitRegEx === undefined) {
  //     return <any>this.setPlanungValues$java_util_List(planungValues);
  //   } else if (((typeof planungValues === 'string') || planungValues === null) && splitRegEx === undefined) {
  //     return <any>this.setPlanungValues$java_lang_String(planungValues);
  //   } else throw new Error('invalid overload');
  // }
  //
  // /*private*/
  // createEmptyPlanung(): string {
  //   const sb: { str: string, toString: Function } = {
  //     str: "", toString: function () {
  //       return this.str;
  //     }
  //   };
  //   for (let i: number = 1; i <= Planungsdaten.ANZAHL_MONATE; i++) {
  //     {
  //       /* append */
  //       (sb => {
  //         sb.str += <any>"0,";
  //         return sb;
  //       })(sb);
  //     }
  //     ;
  //   }
  //   const result: string = /* toString */sb.str.substring(0, /* toString */sb.str.length - 2);
  //   return result;
  // }
  //

  /**
   * Ermöglicht das Setzen einer ElterngeldArt für einen spezifischen Lebensmonat.
   *
   * @param {number} lebensMonat Lebensmonat des Kindes (nicht Index!!!)
   * @param {ElternGeldArt} elterngeldArt Elterngeldart, die gesetzt werden soll.
   */
  public set(lebensMonat: number, elterngeldArt: ElternGeldArt): void {
    const index: number = lebensMonat - 1;
    this.planung[index] = elterngeldArt;
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
