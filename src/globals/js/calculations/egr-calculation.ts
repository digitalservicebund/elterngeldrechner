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
} from "./model";
import { BasisEgAlgorithmus } from "./basis-eg-algorithmus";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { EgZwischenErgebnisAlgorithmus } from "./eg-zwischen-ergebnis-algorithmus";
import { PlusEgAlgorithmus } from "./plus-eg-algorithmus";
import { errorOf } from "./calculation-error-code";
import { BIG_ZERO } from "@/globals/js/calculations/common/math-util";
import { elternGeldSimulationErgebnisOf } from "@/globals/js/calculations/ergebnis-utils";

export class EgrCalculation {
  private static readonly BASIS_ELTERN_GELD_MAX_MONATE = 14;
  private bruttoNettoRechner = new BruttoNettoRechner();
  private basisEgAlgorithmus = new BasisEgAlgorithmus();
  private zwischenErgebnisAlgorithmus = new EgZwischenErgebnisAlgorithmus();

  /**
   * Aus den angegebenen Daten wird sowohl das Basiselterngeld als auch das ElterngeldPlus errechnet.
   * Beides wird sozusagen simuliert, damit es im Monatsplaner angezeigt werden kann.
   *
   * @param persoenlicheDaten Persönliche Angaben für die Berechnung des Elterngeldes.
   * @param finanzDaten Angaben zum Einkommen für die Berechnung des Elterngeldes.
   * @param lohnSteuerJahr Das Lohnsteuerjahr für den Brutto-Netto-Rechner.
   * @param mutterschaftsLeistung Die Angaben zum Bezug von Mutterschaftsleistungen.
   */
  async simulate(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: number,
    mutterschaftsLeistung: MutterschaftsLeistung,
  ): Promise<ElternGeldSimulationErgebnis> {
    const planungsDaten = new PlanungsDaten(
      persoenlicheDaten.isAlleinerziehend(),
      persoenlicheDaten.isETVorGeburt(),
      false,
      mutterschaftsLeistung,
    );

    planungsDaten.planung = new Array<ElternGeldArt>(
      EgrCalculation.BASIS_ELTERN_GELD_MAX_MONATE,
    ).fill(ElternGeldArt.BASIS_ELTERNGELD);
    const basisElternGeldErgebnis = await this.calculateElternGeld(
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
    const elternGeldPlusErgebnis = await this.calculateElternGeld(
      {
        // The current algorithms have side effects. It changes the input data, e.g. persoenlicheDaten.etVorGeburt in basis-eg-algorithmus.ts:259
        finanzDaten: finanzDatenOf(finanzDaten),
        persoenlicheDaten: persoenlicheDatenOf(persoenlicheDaten),
        planungsDaten: planungsDaten,
      },
      lohnSteuerJahr,
    );

    // Create a list of netto for each Lebensmonat. Similar to ElternGeldAusgabe for each Lebensmonat.
    const nettoLebensMonat = await this.nettoLebensMonatOf(
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

  async calculate(
    elternTeil1: ElternGeldDaten,
    elternTeil2: ElternGeldDaten,
    lohnSteuerJahr: number,
  ): Promise<ElternGeldErgebnis> {
    const plusErgebnisElternTeil1 = await this.calculateElternGeld(
      elternTeil1,
      lohnSteuerJahr,
    );
    const plusErgebnisElternTeil2 = await this.calculateElternGeld(
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
  private async nettoLebensMonatOf(
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: number,
    etVorGeburt: ErwerbsArt,
  ) {
    const nettoLebensMonat: Big[] = new Array<Big>(PLANUNG_ANZAHL_MONATE).fill(
      BIG_ZERO,
    );
    // calculate netto for one month in each period and then set it for all months of the respective period
    for (const erwerbsZeitraumLebensMonat of finanzDaten.erwerbsZeitraumLebensMonatList) {
      const brutto = erwerbsZeitraumLebensMonat.bruttoProMonat.value;
      const abzuege: Big = await this.bruttoNettoRechner.abzuege(
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

  private async calculateElternGeld(
    elternGeldDaten: ElternGeldDaten,
    lohnSteuerJahr: number,
  ): Promise<ElternGeldPlusErgebnis> {
    // Steuern berechnen wenn erwerbstätig vor Geburt
    const zwischenErgebnisEinkommen = await this.zwischenErgebnisEinkommenOf(
      elternGeldDaten,
      lohnSteuerJahr,
    );

    const zwischenErgebnis: ZwischenErgebnis =
      this.zwischenErgebnisAlgorithmus.elterngeldZwischenergebnis(
        elternGeldDaten.persoenlicheDaten,
        zwischenErgebnisEinkommen.nettoEinkommen,
      );

    if (elternGeldDaten.persoenlicheDaten.etNachGeburt !== YesNo.YES) {
      elternGeldDaten.finanzDaten.erwerbsZeitraumLebensMonatList = [];
    }
    if (
      elternGeldDaten.finanzDaten.isMischeinkommen() &&
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis === null
    ) {
      throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
    }

    return await new PlusEgAlgorithmus().elterngeldPlusErgebnis(
      elternGeldDaten.planungsDaten,
      elternGeldDaten.persoenlicheDaten,
      elternGeldDaten.finanzDaten,
      lohnSteuerJahr,
      zwischenErgebnisEinkommen.mischEkZwischenErgebnis,
      zwischenErgebnis,
    );
  }

  private async zwischenErgebnisEinkommenOf(
    elternGeldDaten: ElternGeldDaten,
    lohnSteuerJahr: number,
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
          await this.basisEgAlgorithmus.berechneMischNettoUndBasiselterngeld(
            elternGeldDaten.persoenlicheDaten,
            elternGeldDaten.finanzDaten,
            lohnSteuerJahr,
          );
      } else {
        zwischenErgebnisEinkommen.nettoEinkommen =
          await this.bruttoNettoRechner.nettoEinkommenZwischenErgebnis(
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
