import { berechneMischNettoUndBasiselterngeld } from "./basis-eg-algorithmus";
import { nettoEinkommenZwischenErgebnis } from "./brutto-netto-rechner/brutto-netto-rechner";
import { errorOf } from "./calculation-error-code";
import { elterngeldZwischenergebnis } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldDaten,
  ElternGeldPlusErgebnis,
  ErwerbsArt,
  type Lohnsteuerjahr,
  MischEkZwischenErgebnis,
  finanzDatenOf,
} from "./model";
import { elterngeldPlusErgebnis } from "./plus-eg-algorithmus";

export function calculateElternGeld(
  elternGeldDaten: ElternGeldDaten,
  lohnSteuerJahr: Lohnsteuerjahr,
): ElternGeldPlusErgebnis {
  const clonedElterngeldDaten = {
    persoenlicheDaten: structuredClone(elternGeldDaten.persoenlicheDaten),
    finanzDaten: finanzDatenOf(elternGeldDaten.finanzDaten),
    planungsDaten: elternGeldDaten.planungsDaten,
  };

  const zwischenErgebnisEinkommen = zwischenErgebnisEinkommenOf(
    clonedElterngeldDaten,
    lohnSteuerJahr,
  );

  const zwischenErgebnis = elterngeldZwischenergebnis(
    clonedElterngeldDaten.persoenlicheDaten,
    zwischenErgebnisEinkommen.nettoEinkommen,
  );

  if (!clonedElterngeldDaten.persoenlicheDaten.hasEtNachGeburt) {
    clonedElterngeldDaten.finanzDaten.erwerbsZeitraumLebensMonatList = [];
  }

  if (
    clonedElterngeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0 &&
    zwischenErgebnisEinkommen.mischEkZwischenErgebnis === null
  ) {
    throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
  }

  return elterngeldPlusErgebnis(
    clonedElterngeldDaten.planungsDaten,
    clonedElterngeldDaten.persoenlicheDaten,
    clonedElterngeldDaten.finanzDaten,
    lohnSteuerJahr,
    zwischenErgebnisEinkommen.mischEkZwischenErgebnis,
    zwischenErgebnis,
  );
}

function zwischenErgebnisEinkommenOf(
  elternGeldDaten: ElternGeldDaten,
  lohnSteuerJahr: Lohnsteuerjahr,
) {
  korrigiereErwerbsart(elternGeldDaten);

  const zwischenErgebnisEinkommen: ZwischenErgebnisEinkommen = {
    mischEkZwischenErgebnis: null,
    nettoEinkommen: new Einkommen(0),
  };
  if (elternGeldDaten.persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN) {
    if (
      elternGeldDaten.persoenlicheDaten.etVorGeburt ===
      ErwerbsArt.JA_MISCHEINKOMMEN
    ) {
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis =
        berechneMischNettoUndBasiselterngeld(
          elternGeldDaten.persoenlicheDaten,
          elternGeldDaten.finanzDaten,
          lohnSteuerJahr,
        );
    } else {
      zwischenErgebnisEinkommen.nettoEinkommen = nettoEinkommenZwischenErgebnis(
        elternGeldDaten.finanzDaten,
        elternGeldDaten.persoenlicheDaten.etVorGeburt,
        lohnSteuerJahr,
      );
    }
  }
  return zwischenErgebnisEinkommen;
}

function korrigiereErwerbsart(elternGeldDaten: ElternGeldDaten) {
  // mischeinkommen löschen, falls welche vorhanden sind, der der Algorithmus
  if (
    elternGeldDaten.persoenlicheDaten.etVorGeburt !==
      ErwerbsArt.JA_MISCHEINKOMMEN &&
    elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0
  ) {
    elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten = [];
  }
}

interface ZwischenErgebnisEinkommen {
  mischEkZwischenErgebnis: MischEkZwischenErgebnis | null;
  nettoEinkommen: Einkommen;
}
