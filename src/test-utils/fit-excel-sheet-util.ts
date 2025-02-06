import { utc } from "@date-fns/utc";
import { addDays, parseISO } from "date-fns";
import { ElternGeldArt, ErwerbsArt } from "@/globals/js/calculations/model";

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
    default:
      throw new Error(`status ${statusErwerbsArt} unknown`);
  }
};

export function dateFromExcelSerial(excelSerialDate: number) {
  return addDays(parseISO("1900-01-01", { in: utc }), excelSerialDate - 2);
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
