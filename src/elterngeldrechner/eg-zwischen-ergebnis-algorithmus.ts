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
import { BETRAG_MEHRLINGSZUSCHLAG } from "@/elterngeldrechner/model/egr-berechnung-param-id";

export function elterngeldZwischenergebnis(
  persoenlicheDaten: PersoenlicheDaten,
  nettoEinkommen: Einkommen,
): ZwischenErgebnis {
  const no_kinder: number = persoenlicheDaten.anzahlKuenftigerKinder;
  const ek_vor: Einkommen =
    ErwerbsArt.NEIN !== persoenlicheDaten.etVorGeburt
      ? nettoEinkommen
      : new Einkommen(0);
  let ek_vor_copy = 0;
  ek_vor_copy = ek_vor_copy + ek_vor.value;
  const status_et: ErwerbsArt = persoenlicheDaten.etVorGeburt;
  let mehrlingszuschlag: number;
  let elterngeldbasis: number;
  let ersatzrate_ausgabe;
  const betrag_Mehrlingszuschlag = BETRAG_MEHRLINGSZUSCHLAG;

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
  if (no_kinder > 1) {
    mehrlingszuschlag = betrag_Mehrlingszuschlag * (no_kinder - 1);
  } else {
    mehrlingszuschlag = 0;
  }

  elterngeldbasis = aufDenCentRunden(elterngeldbasis);
  ersatzrate_ausgabe = aufDenCentRunden(ersatzrate_ausgabe);

  return {
    elternGeld: elterngeldbasis,
    ersatzRate: ersatzrate_ausgabe,
    mehrlingsZulage: mehrlingszuschlag,
    nettoVorGeburt: nettoEinkommen.value,
  };
}
