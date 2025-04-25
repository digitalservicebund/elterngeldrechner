import { berechneBasiselterngeld } from "./einkommensersatzleistung";
import { bestimmeErsatzrate } from "./ersatzrate";
import {
  Einkommen,
  ErwerbsArt,
  PersoenlicheDaten,
  ZwischenErgebnis,
} from "./model";
import { bestimmeWerbekostenpauschale } from "./werbekostenpauschale";
import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";

export function elterngeldZwischenergebnis(
  persoenlicheDaten: PersoenlicheDaten,
  nettoEinkommen: Einkommen,
): ZwischenErgebnis {
  const ek_vor: Einkommen =
    ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt
      ? nettoEinkommen
      : new Einkommen(0);
  let ek_vor_copy = 0;
  ek_vor_copy = ek_vor_copy + ek_vor.value;
  const status_et: ErwerbsArt = persoenlicheDaten.etVorGeburt;
  let elterngeldbasis: number;
  let ersatzrate_ausgabe;

  if (
    status_et === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI ||
    status_et === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI ||
    status_et === ErwerbsArt.JA_NICHT_SELBST_MINI
  ) {
    const werbekostenpauschale = bestimmeWerbekostenpauschale(
      persoenlicheDaten.geburtstagDesKindes,
    );
    ek_vor_copy = Math.max(ek_vor_copy - werbekostenpauschale, 0);
  }
  elterngeldbasis = berechneBasiselterngeld(ek_vor_copy);
  ersatzrate_ausgabe = bestimmeErsatzrate(ek_vor_copy);

  elterngeldbasis = aufDenCentRunden(elterngeldbasis);
  ersatzrate_ausgabe = aufDenCentRunden(ersatzrate_ausgabe);

  return {
    elternGeld: elterngeldbasis,
    ersatzRate: ersatzrate_ausgabe,
    nettoVorGeburt: nettoEinkommen.value,
  };
}
