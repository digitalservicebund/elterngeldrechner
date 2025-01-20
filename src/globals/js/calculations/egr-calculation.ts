import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { errorOf } from "./calculation-error-code";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import {
  Einkommen,
  ElternGeldDaten,
  ElternGeldPlusErgebnis,
  ErwerbsArt,
  type Lohnsteuerjahr,
  MischEkZwischenErgebnis,
  ZwischenErgebnis,
  finanzDatenOf,
} from "./model";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";

export class EgrCalculation {
  private readonly bruttoNettoRechner = new BruttoNettoRechner();
  private readonly basisEgAlgorithmus = new BasisEgAlgorithmus();
  private readonly zwischenErgebnisAlgorithmus =
    new EgZwischenErgebnisAlgorithmus();

  public calculateElternGeld(
    elternGeldDaten: ElternGeldDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
  ): ElternGeldPlusErgebnis {
    const clonedElterngeldDaten = {
      persoenlicheDaten: structuredClone(elternGeldDaten.persoenlicheDaten),
      finanzDaten: finanzDatenOf(elternGeldDaten.finanzDaten),
      planungsDaten: elternGeldDaten.planungsDaten,
    };

    // Steuern berechnen wenn erwerbstätig vor Geburt
    const zwischenErgebnisEinkommen = this.zwischenErgebnisEinkommenOf(
      clonedElterngeldDaten,
      lohnSteuerJahr,
    );

    const zwischenErgebnis: ZwischenErgebnis =
      this.zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
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

    return new PlusEgAlgorithmus().elterngeldPlusErgebnis(
      clonedElterngeldDaten.planungsDaten,
      clonedElterngeldDaten.persoenlicheDaten,
      clonedElterngeldDaten.finanzDaten,
      lohnSteuerJahr,
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis,
      zwischenErgebnis,
    );
  }

  private zwischenErgebnisEinkommenOf(
    elternGeldDaten: ElternGeldDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
  ) {
    EgrCalculation.korrigiereErwerbsart(elternGeldDaten);

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
          this.basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
            elternGeldDaten.persoenlicheDaten,
            elternGeldDaten.finanzDaten,
            lohnSteuerJahr,
          );
      } else {
        zwischenErgebnisEinkommen.nettoEinkommen =
          this.bruttoNettoRechner.nettoEinkommenZwischenErgebnis(
            elternGeldDaten.finanzDaten,
            elternGeldDaten.persoenlicheDaten.etVorGeburt,
            lohnSteuerJahr,
          );
      }
    }
    return zwischenErgebnisEinkommen;
  }

  private static korrigiereErwerbsart(elternGeldDaten: ElternGeldDaten) {
    // mischeinkommen löschen, falls welche vorhanden sind, der der Algorithmus
    if (
      elternGeldDaten.persoenlicheDaten.etVorGeburt !==
        ErwerbsArt.JA_MISCHEINKOMMEN &&
      elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten.length > 0
    ) {
      elternGeldDaten.finanzDaten.mischEinkommenTaetigkeiten = [];
    }
  }
}

interface ZwischenErgebnisEinkommen {
  mischEkZwischenErgebnis: MischEkZwischenErgebnis | null;
  nettoEinkommen: Einkommen;
}
