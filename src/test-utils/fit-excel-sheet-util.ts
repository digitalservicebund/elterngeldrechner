import { ElternGeldArt, ErwerbsArt } from "@/globals/js/calculations/model";
import { DateTime } from "luxon";

export namespace FitExcelSheetUtil {
  export const erwerbsArtOf = (statusErwerbsArt: number) => {
    switch (statusErwerbsArt) {
      case 1:
        return ErwerbsArt.JA_SELBSTSTAENDIG;
      case 2:
        return ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
      case 3:
        return ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
      case 4:
        return ErwerbsArt.JA_NICHT_SELBST_MINI;
    }
    throw new Error(`status ${statusErwerbsArt} unknown`);
  };

  export function dateFromExcelSerial(excelSerialDate: number) {
    return DateTime.fromISO("1900-01-01", { zone: "utc" })
      .plus({ days: excelSerialDate - 2 })
      .toJSDate();
  }

  export function elterngeldArtOf(elterngeldArt: string) {
    switch (elterngeldArt) {
      case "kein Bezug":
        return ElternGeldArt.KEIN_BEZUG;
      case "Basiselterngeld":
        return ElternGeldArt.BASIS_ELTERNGELD;
      case "Elterngeld Plus":
        return ElternGeldArt.ELTERNGELD_PLUS;
      case "Partnerschaftsbonus":
        return ElternGeldArt.PARTNERSCHAFTS_BONUS;
      default:
        throw new Error(`elterngeldArt ${elterngeldArt} unknown`);
    }
  }
}
