import Big from "big.js";
import { AbstractAlgorithmus } from "./abstract-algorithmus";
import { BruttoNettoRechner } from "./brutto-netto-rechner/brutto-netto-rechner";
import { errorOf } from "./calculation-error-code";
import {
  ElternGeldArt,
  ElternGeldAusgabe,
  ElternGeldKategorie,
  ElternGeldPlusErgebnis,
  ErwerbsArt,
  type ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  FinanzDatenBerechnet,
  type Lohnsteuerjahr,
  MischEkZwischenErgebnis,
  MutterschaftsLeistung,
  PLANUNG_ANZAHL_MONATE,
  PersoenlicheDaten,
  PlanungsDaten,
  ZwischenErgebnis,
  bruttoLeistungsMonateWithPlanung,
  mutterschaftsLeistungInMonaten,
} from "./model";
import {
  minusDays,
  plusMonths,
  setDayOfMonth,
} from "@/globals/js/calculations/common/date-util";
import { aufDenCentRunden } from "@/globals/js/calculations/common/math-util";
import { bruttoEGPlusNeu } from "@/globals/js/calculations/eg-brutto-rechner";
import {
  BETRAG_MEHRLINGSZUSCHLAG,
  MINDESTSATZ,
  MIN_GESCHWISTERBONUS,
  PAUSCH,
  RATE_BONUS,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

export class PlusEgAlgorithmus extends AbstractAlgorithmus {
  private readonly bruttoNettoRechner = new BruttoNettoRechner();

  private pb_von: Date | null = null;
  private pb_bis: Date | null = null;
  private hatPartnerbonus?: boolean;
  // Das Array wird mit Index 1-32 benutzt.
  public anfang_LM: Date[] = new Array<Date>(PLANUNG_ANZAHL_MONATE + 1);
  // Das Array wird mit Index 1-32 benutzt.
  public ende_LM: Date[] = new Array<Date>(PLANUNG_ANZAHL_MONATE + 1);

  public elterngeldPlusErgebnis(
    planungsergebnis: PlanungsDaten,
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
    z: ZwischenErgebnis,
  ): ElternGeldPlusErgebnis {
    // Das Array wird mit Index 1-32 benutzt.
    let brutto_LM_Plus = new Array<number>(PLANUNG_ANZAHL_MONATE + 1);
    // Das Array wird mit Index 1-32 benutzt.
    let brutto_LM_Basis = new Array<number>(PLANUNG_ANZAHL_MONATE + 1);
    brutto_LM_Plus.fill(0);
    brutto_LM_Basis.fill(0);
    const etVorGeburt: boolean =
      persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN;
    const eg_verlauf: ElternGeldArt[] = planungsergebnis.planung;
    let ergebnis: ElternGeldPlusErgebnis;
    const finanzDatenBerechnet: FinanzDatenBerechnet = {
      bruttoEinkommenDurch: 0,
      bruttoEinkommenPlusDurch: 0,
      bruttoLMBasis: [],
      bruttoLMPlus: [],
      lmMitETBasis: 0,
      lmMitETPlus: 0,
      summeBruttoBasis: 0,
      summeBruttoPlus: 0,
    };
    if (!etVorGeburt) {
      ergebnis = PlusEgAlgorithmus.ohneETVorGeburt();
    } else {
      ergebnis = this.mitETVorGeburt(
        planungsergebnis,
        persoenlicheDaten,
        finanzDaten,
        lohnSteuerJahr,
        mischEkZwischenErgebnis,
        z,
      );
    }
    this.hatPartnerbonus = false;
    //let listBruttoLMBasis: Array<Big> = finanzDatenBerechnet.bruttoLMBasis;
    //let listBruttoLMPlus: Array<Big> = finanzDatenBerechnet.bruttoLMPlus;
    const listBruttoLMPlus = bruttoLeistungsMonateWithPlanung(
      finanzDaten.erwerbsZeitraumLebensMonatList,
      true,
      planungsergebnis,
    );
    const listBruttoLMBasis = bruttoLeistungsMonateWithPlanung(
      finanzDaten.erwerbsZeitraumLebensMonatList,
      false,
      planungsergebnis,
    );
    if (listBruttoLMBasis != null && listBruttoLMBasis.length > 0) {
      brutto_LM_Basis = listBruttoLMBasis;
    }
    if (listBruttoLMPlus != null && listBruttoLMPlus.length > 0) {
      brutto_LM_Plus = listBruttoLMPlus;
    }
    finanzDatenBerechnet.bruttoLMBasis = listBruttoLMBasis;
    finanzDatenBerechnet.bruttoLMPlus = listBruttoLMPlus;
    if (!etVorGeburt) {
      // Das Array wird mit Index 1-32 benutzt.
      finanzDatenBerechnet.bruttoLMPlus = new Array<number>(
        PLANUNG_ANZAHL_MONATE + 1,
      ).fill(0);
    }
    const verlauf: ElternGeldKategorie[] = this.determineElternGeldKategorie(
      finanzDatenBerechnet,
      eg_verlauf,
      brutto_LM_Basis,
      brutto_LM_Plus,
      etVorGeburt,
    );
    ergebnis = this.validateEinkommenPartnerBonus(ergebnis);
    return this.createElterngeldAusgabe(
      persoenlicheDaten,
      finanzDaten,
      ergebnis,
      z,
      mischEkZwischenErgebnis,
      verlauf,
      planungsergebnis,
    );
  }

  private static getEKVor(
    finanzDaten: FinanzDaten,
    ek_vor: number,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
  ): number {
    const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

    if (isMischeinkommen) {
      if (mischEkZwischenErgebnis === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }

      ek_vor = mischEkZwischenErgebnis.netto;
      if (mischEkZwischenErgebnis.status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
        ek_vor = ek_vor + PAUSCH;
      }
    }
    return ek_vor;
  }

  private static ohneETVorGeburt(): ElternGeldPlusErgebnis {
    return {
      elternGeldAusgabe: [],
      ersatzRate: 0,
      etVorGeburt: false,
      geschwisterBonus: 0,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: 0,
      nettoNachGeburtDurch: 0,

      elternGeldBasis: MINDESTSATZ,
      elternGeldKeineEtPlus: MINDESTSATZ / 2,
      bruttoBasis: 0,
      nettoBasis: 0,
      elternGeldErwBasis: 0,
      bruttoPlus: 0,
      nettoPlus: 0,
      elternGeldEtPlus: 0,
    };
  }

  private mitETVorGeburt(
    planungsergebnis: PlanungsDaten,
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    lohnSteuerJahr: Lohnsteuerjahr,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
    z: ZwischenErgebnis,
  ): ElternGeldPlusErgebnis {
    const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

    const nicht_erw = persoenlicheDaten.hasEtNachGeburt;
    let ek_nach_plus;
    let elterngeld_erw_plus: number;
    let brutto_basis = 0;
    let netto_basis = 0;
    let elterngeld_erw_basis = 0;
    let brutto_plus = 0;
    let netto_plus = 0;
    let elterngeld_et_plus = 0;
    let elterngeld_keine_et_plus = 0;
    if (nicht_erw) {
      // es liegt Erwerbstätigkeit nach der Geburt vor
      const pausch = PAUSCH;
      // if (finanzDaten.erwerbsZeitraumLeistungsMonatList == null) {
      //   finanzDaten.erwerbsZeitraumLeistungsMonatList = [];
      // }
      if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
        throw new Error("wahrscheinlichesGeburtsDatum === undefined");
      }
      const geburt: Date = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      const anzahl_monate: number = zaehleMonateErwerbsTaetigkeit(
        finanzDaten.erwerbsZeitraumLebensMonatList,
      );
      if (anzahl_monate != null && anzahl_monate !== 0) {
        let summe_brutto_basis = 0;
        let summe_brutto_plus = 0;
        this.fillLebensMonateList(geburt);
        const finanzDatenBerechnet = bruttoEGPlusNeu(
          planungsergebnis,
          finanzDaten,
        );
        const lm_mit_et_basis: number = finanzDatenBerechnet.lmMitETBasis;
        const lm_mit_et_plus: number = finanzDatenBerechnet.lmMitETPlus;
        const bruttoLMPlus = bruttoLeistungsMonateWithPlanung(
          finanzDaten.erwerbsZeitraumLebensMonatList,
          true,
          planungsergebnis,
        );
        const bruttoLMBasis = bruttoLeistungsMonateWithPlanung(
          finanzDaten.erwerbsZeitraumLebensMonatList,
          false,
          planungsergebnis,
        );
        const brutto_LM_Plus = /* toArray */ bruttoLMPlus.slice(0);
        const brutto_LM_Basis = /* toArray */ bruttoLMBasis.slice(0);
        let steuer_sozab_basis = 0;
        let steuer_sozab_plus = 0;
        brutto_basis = finanzDatenBerechnet.bruttoEinkommenDurch;
        brutto_plus = finanzDatenBerechnet.bruttoEinkommenPlusDurch;
        if (persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
          netto_basis = brutto_basis;
          netto_plus = brutto_plus;
        } else {
          if (brutto_basis > 0) {
            steuer_sozab_basis = this.bruttoNettoRechner.abzuege(
              brutto_basis,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
          if (brutto_plus > 0) {
            steuer_sozab_plus = this.bruttoNettoRechner.abzuege(
              brutto_plus,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
        }
        let ek_vor = z.nettoVorGeburt;
        ek_vor = PlusEgAlgorithmus.getEKVor(
          finanzDaten,
          ek_vor,
          mischEkZwischenErgebnis,
        );
        if (brutto_basis > 0) {
          switch (persoenlicheDaten.etVorGeburt) {
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
              ek_vor = Math.max(aufDenCentRunden(ek_vor - PAUSCH), 0);
              summe_brutto_basis = 0;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                const bruttoInLebensmonatenMitBasis = brutto_LM_Basis[i] ?? 0;

                if (
                  bruttoInLebensmonatenMitBasis !== 0 &&
                  planungsergebnis.planung[i - 1] ===
                    ElternGeldArt.BASIS_ELTERNGELD
                ) {
                  summe_brutto_basis =
                    summe_brutto_basis +
                    aufDenCentRunden(
                      Math.max(bruttoInLebensmonatenMitBasis - pausch, 0),
                    );
                }
              }
              if (lm_mit_et_basis > 0) {
                brutto_basis = aufDenCentRunden(
                  summe_brutto_basis / lm_mit_et_basis,
                );
              }
              break;
            default:
          }
          netto_basis = Math.max(brutto_basis - steuer_sozab_basis, 0);
          const ek_nach_basis = netto_basis;
          elterngeld_erw_basis = aufDenCentRunden(
            this.elterngeld_et(ek_vor, Big(ek_nach_basis)),
          );
        }
        if (brutto_plus > 0) {
          let status: ErwerbsArt;
          if (isMischeinkommen) {
            if (mischEkZwischenErgebnis === null) {
              throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
            }
            status = mischEkZwischenErgebnis.status;
          } else {
            status = persoenlicheDaten.etVorGeburt;
          }
          ek_vor = z.nettoVorGeburt;
          ek_vor = PlusEgAlgorithmus.getEKVor(
            finanzDaten,
            ek_vor,
            mischEkZwischenErgebnis,
          );
          switch (status) {
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
              ek_vor = Math.max(ek_vor - PAUSCH, 0);
              summe_brutto_plus = 0;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                const bruttoInLebensmonatenMitPlus = brutto_LM_Plus[i] ?? 0;

                if (
                  bruttoInLebensmonatenMitPlus !== 0 &&
                  (planungsergebnis.planung[i - 1] ===
                    ElternGeldArt.ELTERNGELD_PLUS ||
                    planungsergebnis.planung[i - 1] ===
                      ElternGeldArt.PARTNERSCHAFTS_BONUS)
                ) {
                  summe_brutto_plus =
                    summe_brutto_plus +
                    aufDenCentRunden(
                      Math.max(bruttoInLebensmonatenMitPlus - pausch, 0),
                    );
                }
              }
              if (lm_mit_et_plus > 0) {
                brutto_plus = aufDenCentRunden(
                  summe_brutto_plus / lm_mit_et_plus,
                );
              }
              break;
            default:
          }
        }
        netto_plus = Math.max(brutto_plus - steuer_sozab_plus, 0);
        ek_nach_plus = netto_plus;
        elterngeld_erw_plus = aufDenCentRunden(
          this.elterngeldplus_et(ek_vor, Big(ek_nach_plus)),
        );
        elterngeld_keine_et_plus = z.elternGeld;
        if (isMischeinkommen) {
          if (mischEkZwischenErgebnis === null) {
            throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
          }
          elterngeld_keine_et_plus = mischEkZwischenErgebnis.elterngeldbasis;
        }
        elterngeld_keine_et_plus = elterngeld_keine_et_plus / 2;
        elterngeld_et_plus = Math.min(
          elterngeld_keine_et_plus,
          elterngeld_erw_plus,
        );
      }
    } else {
      // Sollten keine Perioden angegeben sein, so berechne nichts
      netto_plus = 0;
      elterngeld_keine_et_plus = 0;
      elterngeld_et_plus = 0;
    }
    return {
      elternGeldErwBasis: aufDenCentRunden(elterngeld_erw_basis),
      bruttoBasis: aufDenCentRunden(brutto_basis),
      nettoBasis: aufDenCentRunden(netto_basis),
      bruttoPlus: aufDenCentRunden(brutto_plus),
      nettoPlus: aufDenCentRunden(netto_plus),
      elternGeldEtPlus: aufDenCentRunden(elterngeld_et_plus),
      elternGeldKeineEtPlus: aufDenCentRunden(elterngeld_keine_et_plus),
      elternGeldAusgabe: [],
      elternGeldBasis: 0,
      ersatzRate: 0,
      etVorGeburt: false,
      geschwisterBonus: 0,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: 0,
      nettoNachGeburtDurch: 0,
    };
  }

  public fillLebensMonateList(geburt: Date) {
    // Die Arrays anfang_LM und ende_LM werden mit Index 1-32 benutzt.
    for (let i: number = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
      const anfang: Date = plusMonths(geburt, i);
      const ende: Date = minusDays(plusMonths(geburt, i + 1), 1);
      this.anfang_LM[i + 1] = anfang;
      this.ende_LM[i + 1] = ende;
      if (
        geburt.getDay() > 28 &&
        anfang.getMonth() === 2 &&
        anfang.getDay() < 5
      ) {
        // this.anfang_LM[i] = new DateTime(new GregorianCalendar(calGeburt.get(YEAR), calGeburt.get(MONTH) + i + 1, 1).getTime());
        this.anfang_LM[i + 1] = setDayOfMonth(plusMonths(geburt, i + 1), 1);
      }
      if (geburt.getDay() > 28 && ende.getMonth() === 2 && ende.getDay() < 5) {
        // this.anfang_LM[i] = new DateTime(new GregorianCalendar(calGeburt.get(YEAR), calGeburt.get(MONTH) + i + 2, 0).getTime());
        this.anfang_LM[i + 1] = minusDays(
          setDayOfMonth(plusMonths(geburt, i + 2), 1),
          1,
        );
      }
    }
  }

  private determineElternGeldKategorie(
    finanzDatenBerechnet: FinanzDatenBerechnet,
    eg_verlauf: ElternGeldArt[], // Das Array wird mit Index 0-31 benutzt.
    brutto_LM_Basis: number[], // Das Array wird mit Index 1-32 benutzt.
    brutto_LM_Plus: number[], // Das Array wird mit Index 1-32 benutzt.
    etVorGeburt: boolean,
  ): ElternGeldKategorie[] {
    const verlauf = new Array<ElternGeldKategorie>(PLANUNG_ANZAHL_MONATE);

    this.hatPartnerbonus = false;
    let pbMonatVon: number = 0;
    let pbMonatBis: number = 0;
    let counter: number = 0;
    for (let index = 0; index < eg_verlauf.length; index++) {
      const monat = eg_verlauf[index];
      counter++;
      if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS && pbMonatVon === 0) {
        pbMonatVon = counter;
        pbMonatBis = counter;
      } else if (monat === ElternGeldArt.PARTNERSCHAFTS_BONUS) {
        pbMonatBis = counter;
      }
    }
    if (!etVorGeburt) {
      // **************************************************************************************************
      // Abweichung vom FIT Algorithmus: an dieser Stelle noch berücksichtigen, ob ET nach Geburt angegeben
      // dies dient zur Validierung des PB-Fehlers im Schritt 4
      const brutto_LM_Plus_pb = finanzDatenBerechnet.bruttoLMPlus;
      for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] !== ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }

        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          (brutto_LM_Plus_pb[i] ?? 0) === 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          (brutto_LM_Plus_pb[i] ?? 0) === 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          (brutto_LM_Plus[i] ?? 0) === 0
        ) {
          this.hatPartnerbonus = true;
          break;
        }
      }
    } else {
      for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (eg_verlauf[i - 1] === ElternGeldArt.KEIN_BEZUG) {
          verlauf[i - 1] = ElternGeldKategorie.KEIN_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD &&
          (brutto_LM_Basis[i] ?? 0) === 0
        ) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD &&
          (brutto_LM_Basis[i] ?? 0) > 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          (brutto_LM_Plus[i] ?? 0) === 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          (brutto_LM_Plus[i] ?? 0) === 0
        ) {
          this.hatPartnerbonus = true;
          break;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          (brutto_LM_Plus[i] ?? 0) > 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          (brutto_LM_Plus[i] ?? 0) > 0
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
      }
    }
    if (pbMonatVon !== 0 && pbMonatBis !== 0 && this.hatPartnerbonus) {
      if (
        this.anfang_LM[pbMonatVon - 1] != null &&
        this.ende_LM[pbMonatBis - 1] != null
      ) {
        this.pb_von = this.anfang_LM[pbMonatVon - 1] ?? null;
        this.pb_bis = this.ende_LM[pbMonatBis - 1] ?? null;
      }
    }
    return verlauf;
  }

  private createElterngeldAusgabe(
    persoenlicheDaten: PersoenlicheDaten,
    finanzDaten: FinanzDaten,
    ergebnis: ElternGeldPlusErgebnis,
    z: ZwischenErgebnis,
    misch: MischEkZwischenErgebnis | null,
    verlauf: ElternGeldKategorie[],
    planungsergebnis: PlanungsDaten,
  ): ElternGeldPlusErgebnis {
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
      throw new Error("wahrscheinlichesGeburtsDatum === undefined");
    }
    const ende_geschwisterbonus: Date | null = z.zeitraumGeschwisterBonus;
    const geschw = new Array<number>(PLANUNG_ANZAHL_MONATE).fill(0);
    const isGeschwisterVorhanden =
      (persoenlicheDaten.geschwister ?? []).length > 0;

    if (isGeschwisterVorhanden) {
      // es sind Geschwister vorhanden
      const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
      this.fillLebensMonateList(geburt);

      for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
        if (
          ende_geschwisterbonus != null &&
          ende_geschwisterbonus >= (this.anfang_LM[i] ?? 0)
        ) {
          geschw[i - 1] = 1;
        }
      }
    }
    ergebnis.geschwisterBonusDeadLine = ende_geschwisterbonus;
    const ausgabeLebensmonate: ElternGeldAusgabe[] = [];
    let basiselterngeld = z.elternGeld;
    const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

    if (isMischeinkommen) {
      if (misch === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }
      basiselterngeld = misch.elterngeldbasis;
    }
    const basiselterngeld_erw = ergebnis.elternGeldErwBasis;
    const elterngeldplus = aufDenCentRunden(basiselterngeld / 2);
    const elterngeldplus_erw = ergebnis.elternGeldEtPlus;
    const betrag_mehrlingszuschlag = BETRAG_MEHRLINGSZUSCHLAG;
    const min_geschwisterbonus = MIN_GESCHWISTERBONUS;
    const rate_bonus = RATE_BONUS;
    let mehrling: number = 0;
    if (persoenlicheDaten.anzahlKuenftigerKinder > 0) {
      mehrling = persoenlicheDaten.anzahlKuenftigerKinder - 1;
    }
    for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      const ausgabe: ElternGeldAusgabe = {
        lebensMonat: i,
        elterngeldArt:
          planungsergebnis.planung[i - 1] ?? ElternGeldArt.KEIN_BEZUG,
        elternGeld: 0,
        geschwisterBonus: 0,
        mehrlingsZulage: 0,
        mutterschaftsLeistungMonat: false,
      };
      if (
        PlusEgAlgorithmus.isMutterschaftsLeistungImMonat(i, planungsergebnis)
      ) {
        ausgabe.mutterschaftsLeistungMonat = true;
      } else if (this.hatPartnerbonus) {
        // es ist schon alles auf 0 gesetzt
      } else {
        let geschwisterbonus = 0;
        let mehrlingszuschlag = 0;
        let elterngeld = 0;
        if (verlauf[i - 1] === ElternGeldKategorie.KEIN_ELTERN_GELD) {
          geschwisterbonus = 0;
          mehrlingszuschlag = 0;
          elterngeld = 0;
        }
        if (verlauf[i - 1] === ElternGeldKategorie.BASIS_ELTERN_GELD) {
          geschwisterbonus = aufDenCentRunden(
            Math.max(min_geschwisterbonus, basiselterngeld * rate_bonus) *
              (geschw[i - 1] ?? 0),
          );
          mehrlingszuschlag = betrag_mehrlingszuschlag * mehrling;
          elterngeld = basiselterngeld + geschwisterbonus + mehrlingszuschlag;
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = betrag_mehrlingszuschlag * mehrling;
          geschwisterbonus = aufDenCentRunden(
            Math.max(min_geschwisterbonus, basiselterngeld_erw * rate_bonus) *
              (geschw[i - 1] ?? 0),
          );
          elterngeld =
            basiselterngeld_erw + geschwisterbonus + mehrlingszuschlag;
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = (mehrling * betrag_mehrlingszuschlag) / 2;
          geschwisterbonus = aufDenCentRunden(
            Math.max(min_geschwisterbonus / 2, elterngeldplus * rate_bonus) *
              (geschw[i - 1] ?? 0),
          );
          elterngeld = elterngeldplus + geschwisterbonus + mehrlingszuschlag;
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = (betrag_mehrlingszuschlag * mehrling) / 2;
          geschwisterbonus = aufDenCentRunden(
            Math.max(
              min_geschwisterbonus / 2,
              elterngeldplus_erw * rate_bonus,
            ) * (geschw[i - 1] ?? 0),
          );
          elterngeld =
            elterngeldplus_erw + geschwisterbonus + mehrlingszuschlag;
        }
        ausgabe.elternGeld = aufDenCentRunden(elterngeld);
        ausgabe.mehrlingsZulage = aufDenCentRunden(mehrlingszuschlag);
        ausgabe.geschwisterBonus = aufDenCentRunden(geschwisterbonus);
      }
      ausgabeLebensmonate.push(ausgabe);
    }

    if (ergebnis.ersatzRate == null) {
      ergebnis.ersatzRate = aufDenCentRunden(z.ersatzRate);
    }
    ergebnis.elternGeldBasis = aufDenCentRunden(basiselterngeld);
    ergebnis.elternGeldErwBasis = aufDenCentRunden(basiselterngeld_erw);
    ergebnis.elternGeldKeineEtPlus = aufDenCentRunden(elterngeldplus);
    ergebnis.elternGeldEtPlus = aufDenCentRunden(elterngeldplus_erw);
    ergebnis.mehrlingsZulage = aufDenCentRunden(z.mehrlingsZulage);
    ergebnis.geschwisterBonus = aufDenCentRunden(z.geschwisterBonus);
    if (
      !persoenlicheDaten.etVorGeburt ||
      persoenlicheDaten.etVorGeburt === ErwerbsArt.NEIN
    ) {
      ergebnis.etVorGeburt = false;
    }
    ergebnis.elternGeldAusgabe = ausgabeLebensmonate;
    return ergebnis;
  }

  private static isMutterschaftsLeistungImMonat(
    monat: number,
    planungsergebnis: PlanungsDaten,
  ): boolean {
    return (
      planungsergebnis.mutterschaftsLeistung != null &&
      planungsergebnis.mutterschaftsLeistung !==
        MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN &&
      monat <=
        mutterschaftsLeistungInMonaten(planungsergebnis.mutterschaftsLeistung)
    );
  }

  private validateEinkommenPartnerBonus(
    ergebnis: ElternGeldPlusErgebnis,
  ): ElternGeldPlusErgebnis {
    ergebnis.hasPartnerBonusError = false;
    if (this.hatPartnerbonus) {
      ergebnis.hasPartnerBonusError = true;
      ergebnis.bruttoBasis = 0;
      ergebnis.nettoBasis = 0;
      ergebnis.elternGeldErwBasis = 0;
      ergebnis.bruttoPlus = 0;
      ergebnis.nettoPlus = 0;
      ergebnis.elternGeldEtPlus = 0;
      ergebnis.elternGeldKeineEtPlus = 0;
    }
    return ergebnis;
  }
}

function zaehleMonateErwerbsTaetigkeit(
  erwerbsZeitraeume: ErwerbsZeitraumLebensMonat[],
): number {
  return erwerbsZeitraeume.reduce(
    (anzahlMonate, { vonLebensMonat, bisLebensMonat }) =>
      anzahlMonate + Math.max(bisLebensMonat - vonLebensMonat + 1, 0),
    0,
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ElterngeldPlus Algorithmus", async () => {
    const { Einkommen } = await import("./model");

    it("correctly counts the number of Monate for list of Erwerbstätigkeiten", () => {
      const taetigkeiten = [
        { vonLebensMonat: 1, bisLebensMonat: 1, bruttoProMonat: ANY_EINKOMMEN },
        { vonLebensMonat: 1, bisLebensMonat: 2, bruttoProMonat: ANY_EINKOMMEN },
        { vonLebensMonat: 2, bisLebensMonat: 5, bruttoProMonat: ANY_EINKOMMEN },
        { vonLebensMonat: 5, bisLebensMonat: 2, bruttoProMonat: ANY_EINKOMMEN },
      ];

      const anzahlMonate = zaehleMonateErwerbsTaetigkeit(taetigkeiten);

      expect(anzahlMonate).toBe(7);
    });

    const ANY_EINKOMMEN = new Einkommen(0);
  });
}
