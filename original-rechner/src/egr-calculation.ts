import Big from "big.js";
import {
  ElternGeldArt,
  ElternGeldDaten,
  ElternGeldErgebnis,
  ElternGeldPlusErgebnis,
  ElternGeldSimulationErgebnis,
  ErwerbsArt,
  FinanzDaten,
  finanzDatenOf,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  NettoEinkommen,
  PersoenlicheDaten,
  persoenlicheDatenOf,
  PLANUNG_ANZAHL_MONATE,
  PlanungsDaten,
  YesNo,
  ZwischenErgebnis,
  Einkommen,
  type Lohnsteuerjahr,
} from "./model";
import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";
import { errorOf } from "./calculation-error-code";
import { planungsDatenOf } from "./model/planungs-daten";
import { BIG_ZERO } from "./common/math-util";
import { elternGeldSimulationErgebnisOf } from "./ergebnis-utils";

export class EgrCalculation {
  private static readonly BASIS_ELTERN_GELD_MAX_MONATE = 14;
  private readonly bruttoNettoRechner = new BruttoNettoRechner();
  private readonly basisEgAlgorithmus = new BasisEgAlgorithmus();
  private readonly zwischenErgebnisAlgorithmus =
    new EgZwischenErgebnisAlgorithmus();

  /**
   * Aus den angegebenen Daten wird sowohl das Basiselterngeld als auch das ElterngeldPlus errechnet.
   * Beides wird sozusagen simuliert, damit es im Monatsplaner angezeigt werden kann.
   *
   * @param persoenlicheDaten Persönliche Angaben für die Berechnung des Elterngeldes.
   * @param finanzDaten Angaben zum Einkommen für die Berechnung des Elterngeldes.
   * @param lohnSteuerJahr Das Lohnsteuerjahr für den Brutto-Netto-Rechner.
   * @param mutterschaftsLeistung Die Angaben zum Bezug von Mutterschaftsleistungen.
   */
  simulate(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
    mutterschaftsLeistung: MutterschaftsLeistung,
  ): ElternGeldSimulationErgebnis {
    const planungsDaten = new PlanungsDaten(
      persoenlicheDaten.isAlleinerziehend(),
      persoenlicheDaten.isETVorGeburt(),
      false,
      mutterschaftsLeistung,
    );

    planungsDaten.planung = new Array<ElternGeldArt>(
      EgrCalculation.BASIS_ELTERN_GELD_MAX_MONATE,
    ).fill(ElternGeldArt.BASIS_ELTERNGELD);
    const basisElternGeldErgebnis = this.calculateElternGeld(
      {
        // The current algorithms have side effects. It changes the input data, e.g. persoenlicheDaten.etVorGeburt in basis-eg-algorithmus.ts:259
        finanzDaten: finanzDatenOf(finanzDaten),
        persoenlicheDaten: persoenlicheDatenOf(persoenlicheDaten),
        planungsDaten: planungsDaten,
      },
      lohnSteuerJahr,
    );

    planungsDaten.planung = new Array<ElternGeldArt>(
      PLANUNG_ANZAHL_MONATE,
    ).fill(ElternGeldArt.ELTERNGELD_PLUS);
    const elternGeldPlusErgebnis = this.calculateElternGeld(
      {
        // The current algorithms have side effects. It changes the input data, e.g. persoenlicheDaten.etVorGeburt in basis-eg-algorithmus.ts:259
        finanzDaten: finanzDatenOf(finanzDaten),
        persoenlicheDaten: persoenlicheDatenOf(persoenlicheDaten),
        planungsDaten: planungsDaten,
      },
      lohnSteuerJahr,
    );

    // Create a list of netto for each Lebensmonat. Similar to ElternGeldAusgabe for each Lebensmonat.
    const nettoLebensMonat = this.nettoLebensMonatOf(
      finanzDaten,
      lohnSteuerJahr,
      persoenlicheDaten.etVorGeburt,
    );

    return elternGeldSimulationErgebnisOf(
      basisElternGeldErgebnis.elternGeldAusgabe,
      elternGeldPlusErgebnis.elternGeldAusgabe,
      nettoLebensMonat,
    );
  }

  calculate(
    elternTeil1: ElternGeldDaten,
    elternTeil2: ElternGeldDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
  ): ElternGeldErgebnis {
    const plusErgebnisElternTeil1 = this.calculateElternGeld(
      elternTeil1,
      lohnSteuerJahr,
    );
    const plusErgebnisElternTeil2 = this.calculateElternGeld(
      elternTeil2,
      lohnSteuerJahr,
    );
    return {
      elternTeil1: plusErgebnisElternTeil1,
      elternTeil2: plusErgebnisElternTeil2,
    };
  }

  /**
   * Create a list of netto for each Lebensmonat. Similar to ElternGeldAusgabe for each Lebensmonat.
   */
  private nettoLebensMonatOf(
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
    etVorGeburt: ErwerbsArt,
  ) {
    const nettoLebensMonat: Big[] = new Array<Big>(PLANUNG_ANZAHL_MONATE).fill(
      BIG_ZERO,
    );
    // calculate netto for one month in each period and then set it for all months of the respective period
    for (const erwerbsZeitraumLebensMonat of finanzDaten.erwerbsZeitraumLebensMonatList) {
      const brutto = erwerbsZeitraumLebensMonat.bruttoProMonat.value;
      const abzuege: Big = this.bruttoNettoRechner.abzuege(
        brutto,
        lohnSteuerJahr,
        finanzDaten,
        etVorGeburt,
      );
      const netto = brutto.sub(abzuege);
      erwerbsZeitraumLebensMonat
        .getLebensMonateList()
        .forEach((lebensMonat) => (nettoLebensMonat[lebensMonat - 1] = netto));
    }
    return nettoLebensMonat;
  }

  public calculateElternGeld(
    elternGeldDaten: ElternGeldDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
  ): ElternGeldPlusErgebnis {
    const clonedElterngeldDaten = {
      persoenlicheDaten: persoenlicheDatenOf(elternGeldDaten.persoenlicheDaten),
      finanzDaten: finanzDatenOf(elternGeldDaten.finanzDaten),
      planungsDaten: planungsDatenOf(elternGeldDaten.planungsDaten),
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

    if (clonedElterngeldDaten.persoenlicheDaten.etNachGeburt !== YesNo.YES) {
      clonedElterngeldDaten.finanzDaten.erwerbsZeitraumLebensMonatList = [];
    }
    if (
      clonedElterngeldDaten.finanzDaten.isMischeinkommen() &&
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
  nettoEinkommen: NettoEinkommen;
}
