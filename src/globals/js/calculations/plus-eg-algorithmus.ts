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
import {
  BIG_ZERO,
  fMax,
  fMin,
  greater,
  isEqual,
  round,
} from "@/globals/js/calculations/common/math-util";
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
    let brutto_LM_Plus = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1);
    // Das Array wird mit Index 1-32 benutzt.
    let brutto_LM_Basis = new Array<Big>(PLANUNG_ANZAHL_MONATE + 1);
    brutto_LM_Plus.fill(BIG_ZERO);
    brutto_LM_Basis.fill(BIG_ZERO);
    const etVorGeburt: boolean =
      persoenlicheDaten.etVorGeburt !== ErwerbsArt.NEIN;
    const eg_verlauf: ElternGeldArt[] = planungsergebnis.planung;
    let ergebnis: ElternGeldPlusErgebnis;
    const finanzDatenBerechnet: FinanzDatenBerechnet = {
      bruttoEinkommenDurch: BIG_ZERO,
      bruttoEinkommenPlusDurch: BIG_ZERO,
      bruttoLMBasis: [],
      bruttoLMPlus: [],
      lmMitETBasis: 0,
      lmMitETPlus: 0,
      summeBruttoBasis: BIG_ZERO,
      summeBruttoPlus: BIG_ZERO,
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
      finanzDatenBerechnet.bruttoLMPlus = new Array<Big>(
        PLANUNG_ANZAHL_MONATE + 1,
      ).fill(BIG_ZERO);
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
    ek_vor: Big,
    mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
  ) {
    const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

    if (isMischeinkommen) {
      if (mischEkZwischenErgebnis === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }

      ek_vor = mischEkZwischenErgebnis.netto;
      if (mischEkZwischenErgebnis.status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
        ek_vor = ek_vor.add(PAUSCH);
      }
    }
    return ek_vor;
  }

  private static ohneETVorGeburt(): ElternGeldPlusErgebnis {
    return {
      elternGeldAusgabe: [],
      ersatzRate: BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: BIG_ZERO,
      nettoNachGeburtDurch: BIG_ZERO,

      elternGeldBasis: Big(MINDESTSATZ),
      elternGeldKeineEtPlus: Big(MINDESTSATZ / 2),
      message:
        "Sie erhalten 300 Euro Elterngeld sowie evtl. Geschwisterbonus und/oder Mehrlingszuschlag",
      bruttoBasis: BIG_ZERO,
      nettoBasis: BIG_ZERO,
      elternGeldErwBasis: BIG_ZERO,
      bruttoPlus: BIG_ZERO,
      nettoPlus: BIG_ZERO,
      elternGeldEtPlus: BIG_ZERO,
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
    let ek_nach_plus: Big;
    let elterngeld_erw_plus: Big;
    let brutto_basis: Big = BIG_ZERO;
    let netto_basis: Big = BIG_ZERO;
    let elterngeld_erw_basis: Big = BIG_ZERO;
    let brutto_plus: Big = BIG_ZERO;
    let netto_plus: Big = BIG_ZERO;
    let elterngeld_et_plus: Big = BIG_ZERO;
    let elterngeld_keine_et_plus: Big = BIG_ZERO;
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
        let summe_brutto_basis: Big = BIG_ZERO;
        let summe_brutto_plus: Big = BIG_ZERO;
        this.fillLebensMonateList(geburt);
        const finanzDatenBerechnet = bruttoEGPlusNeu(
          planungsergebnis,
          finanzDaten,
        );
        const lm_mit_et_basis: number = finanzDatenBerechnet.lmMitETBasis;
        const lm_mit_et_plus: number = finanzDatenBerechnet.lmMitETPlus;
        const bruttoLMPlus: Array<Big> = bruttoLeistungsMonateWithPlanung(
          finanzDaten.erwerbsZeitraumLebensMonatList,
          true,
          planungsergebnis,
        );
        const bruttoLMBasis: Array<Big> = bruttoLeistungsMonateWithPlanung(
          finanzDaten.erwerbsZeitraumLebensMonatList,
          false,
          planungsergebnis,
        );
        const brutto_LM_Plus: Big[] = /* toArray */ bruttoLMPlus.slice(0);
        const brutto_LM_Basis: Big[] = /* toArray */ bruttoLMBasis.slice(0);
        let steuer_sozab_basis: Big = BIG_ZERO;
        let steuer_sozab_plus: Big = BIG_ZERO;
        brutto_basis = finanzDatenBerechnet.bruttoEinkommenDurch;
        brutto_plus = finanzDatenBerechnet.bruttoEinkommenPlusDurch;
        if (persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
          netto_basis = brutto_basis;
          netto_plus = brutto_plus;
        } else {
          if (greater(brutto_basis, BIG_ZERO)) {
            steuer_sozab_basis = this.bruttoNettoRechner.abzuege(
              brutto_basis,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
          if (greater(brutto_plus, BIG_ZERO)) {
            steuer_sozab_plus = this.bruttoNettoRechner.abzuege(
              brutto_plus,
              lohnSteuerJahr,
              finanzDaten,
              persoenlicheDaten.etVorGeburt,
            );
          }
        }
        let ek_vor: Big = z.nettoVorGeburt;
        ek_vor = PlusEgAlgorithmus.getEKVor(
          finanzDaten,
          ek_vor,
          mischEkZwischenErgebnis,
        );
        if (greater(brutto_basis, BIG_ZERO)) {
          switch (persoenlicheDaten.etVorGeburt) {
            case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
            case ErwerbsArt.JA_NICHT_SELBST_MINI:
              ek_vor = fMax(round(ek_vor.sub(PAUSCH)), BIG_ZERO);
              summe_brutto_basis = BIG_ZERO;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                const bruttoInLebensmonatenMitBasis =
                  brutto_LM_Basis[i] ?? BIG_ZERO;

                if (
                  !isEqual(bruttoInLebensmonatenMitBasis, BIG_ZERO) &&
                  planungsergebnis.planung[i - 1] ===
                    ElternGeldArt.BASIS_ELTERNGELD
                ) {
                  summe_brutto_basis = summe_brutto_basis.add(
                    round(
                      fMax(bruttoInLebensmonatenMitBasis.sub(pausch), BIG_ZERO),
                      2,
                    ),
                  );
                }
              }
              if (lm_mit_et_basis > 0) {
                brutto_basis = round(
                  summe_brutto_basis.div(Big(lm_mit_et_basis)),
                  2,
                );
              }
              break;
            default:
          }
          netto_basis = fMax(brutto_basis.sub(steuer_sozab_basis), BIG_ZERO);
          const ek_nach_basis: Big = netto_basis;
          elterngeld_erw_basis = round(
            this.elterngeld_et(ek_vor, ek_nach_basis),
            2,
          );
        }
        if (greater(brutto_plus, BIG_ZERO)) {
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
              ek_vor = fMax(ek_vor.sub(PAUSCH), BIG_ZERO);
              summe_brutto_plus = BIG_ZERO;
              for (let i: number = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
                const bruttoInLebensmonatenMitPlus =
                  brutto_LM_Plus[i] ?? BIG_ZERO;

                if (
                  !isEqual(bruttoInLebensmonatenMitPlus, BIG_ZERO) &&
                  (planungsergebnis.planung[i - 1] ===
                    ElternGeldArt.ELTERNGELD_PLUS ||
                    planungsergebnis.planung[i - 1] ===
                      ElternGeldArt.PARTNERSCHAFTS_BONUS)
                ) {
                  summe_brutto_plus = summe_brutto_plus.add(
                    round(
                      fMax(bruttoInLebensmonatenMitPlus.sub(pausch), BIG_ZERO),
                      2,
                    ),
                  );
                }
              }
              if (lm_mit_et_plus > 0) {
                brutto_plus = round(
                  summe_brutto_plus.div(Big(lm_mit_et_plus)),
                  2,
                );
              }
              break;
            default:
          }
        }
        netto_plus = fMax(brutto_plus.sub(steuer_sozab_plus), BIG_ZERO);
        ek_nach_plus = netto_plus;
        elterngeld_erw_plus = round(
          this.elterngeldplus_et(ek_vor, ek_nach_plus),
          2,
        );
        elterngeld_keine_et_plus = z.elternGeld;
        if (isMischeinkommen) {
          if (mischEkZwischenErgebnis === null) {
            throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
          }
          elterngeld_keine_et_plus = mischEkZwischenErgebnis.elterngeldbasis;
        }
        elterngeld_keine_et_plus = elterngeld_keine_et_plus.div(Big(2));
        elterngeld_et_plus = fMin(
          elterngeld_keine_et_plus,
          elterngeld_erw_plus,
        );
      }
    } else {
      // Sollten keine Perioden angegeben sein, so berechne nichts
      netto_plus = BIG_ZERO;
      elterngeld_keine_et_plus = BIG_ZERO;
      elterngeld_et_plus = BIG_ZERO;
    }
    return {
      elternGeldErwBasis: round(elterngeld_erw_basis, 2),
      bruttoBasis: round(brutto_basis, 2),
      nettoBasis: round(netto_basis, 2),
      bruttoPlus: round(brutto_plus, 2),
      nettoPlus: round(netto_plus, 2),
      elternGeldEtPlus: round(elterngeld_et_plus, 2),
      elternGeldKeineEtPlus: round(elterngeld_keine_et_plus, 2),
      elternGeldAusgabe: [],
      elternGeldBasis: BIG_ZERO,
      ersatzRate: BIG_ZERO,
      etVorGeburt: false,
      geschwisterBonus: BIG_ZERO,
      geschwisterBonusDeadLine: null,
      hasPartnerBonusError: false,
      mehrlingsZulage: BIG_ZERO,
      message: "",
      nettoNachGeburtDurch: BIG_ZERO,
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
    brutto_LM_Basis: Big[], // Das Array wird mit Index 1-32 benutzt.
    brutto_LM_Plus: Big[], // Das Array wird mit Index 1-32 benutzt.
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
          isEqual(brutto_LM_Plus_pb[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          isEqual(brutto_LM_Plus_pb[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          isEqual(brutto_LM_Plus[i] ?? BIG_ZERO, BIG_ZERO)
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
          isEqual(brutto_LM_Basis[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] = ElternGeldKategorie.BASIS_ELTERN_GELD;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.BASIS_ELTERNGELD &&
          greater(brutto_LM_Basis[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          isEqual(brutto_LM_Plus[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          isEqual(brutto_LM_Plus[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          this.hatPartnerbonus = true;
          break;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.ELTERNGELD_PLUS &&
          greater(brutto_LM_Plus[i] ?? BIG_ZERO, BIG_ZERO)
        ) {
          verlauf[i - 1] =
            ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT;
        }
        if (
          eg_verlauf[i - 1] === ElternGeldArt.PARTNERSCHAFTS_BONUS &&
          greater(brutto_LM_Plus[i] ?? BIG_ZERO, BIG_ZERO)
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
    let basiselterngeld: Big = z.elternGeld;
    const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

    if (isMischeinkommen) {
      if (misch === null) {
        throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
      }
      basiselterngeld = misch.elterngeldbasis;
    }
    const basiselterngeld_erw: Big = ergebnis.elternGeldErwBasis;
    const elterngeldplus: Big = round(basiselterngeld.div(Big(2)), 2);
    const elterngeldplus_erw: Big = ergebnis.elternGeldEtPlus;
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
        elternGeld: BIG_ZERO,
        geschwisterBonus: BIG_ZERO,
        mehrlingsZulage: BIG_ZERO,
        mutterschaftsLeistungMonat: false,
      };
      if (
        PlusEgAlgorithmus.isMutterschaftsLeistungImMonat(i, planungsergebnis)
      ) {
        ausgabe.mutterschaftsLeistungMonat = true;
      } else if (this.hatPartnerbonus) {
        // es ist schon alles auf 0 gesetzt
      } else {
        let geschwisterbonus: Big = BIG_ZERO;
        let mehrlingszuschlag = 0;
        let elterngeld: Big = BIG_ZERO;
        if (verlauf[i - 1] === ElternGeldKategorie.KEIN_ELTERN_GELD) {
          geschwisterbonus = BIG_ZERO;
          mehrlingszuschlag = 0;
          elterngeld = BIG_ZERO;
        }
        if (verlauf[i - 1] === ElternGeldKategorie.BASIS_ELTERN_GELD) {
          geschwisterbonus = round(
            fMax(
              Big(min_geschwisterbonus),
              basiselterngeld.mul(rate_bonus),
            ).mul(Big(geschw[i - 1] ?? 0)),
            2,
          );
          mehrlingszuschlag = betrag_mehrlingszuschlag * mehrling;
          elterngeld = basiselterngeld
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.BASIS_ELTERN_GELD_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = betrag_mehrlingszuschlag * mehrling;
          geschwisterbonus = round(
            fMax(
              Big(min_geschwisterbonus),
              basiselterngeld_erw.mul(rate_bonus),
            ).mul(Big(geschw[i - 1] ?? 0)),
            2,
          );
          elterngeld = basiselterngeld_erw
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_OHNE_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = (mehrling * betrag_mehrlingszuschlag) / 2;
          geschwisterbonus = round(
            fMax(
              Big(min_geschwisterbonus / 2),
              elterngeldplus.mul(rate_bonus),
            ).mul(Big(geschw[i - 1] ?? 0)),
            2,
          );
          elterngeld = elterngeldplus
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        if (
          verlauf[i - 1] ===
          ElternGeldKategorie.ELTERN_GELD_PLUS_MIT_ERWERBS_TAETIGKEIT
        ) {
          mehrlingszuschlag = (betrag_mehrlingszuschlag * mehrling) / 2;
          geschwisterbonus = round(
            fMax(
              Big(min_geschwisterbonus / 2),
              elterngeldplus_erw.mul(rate_bonus),
            ).mul(Big(geschw[i - 1] ?? 0)),
            2,
          );
          elterngeld = elterngeldplus_erw
            .add(geschwisterbonus)
            .add(mehrlingszuschlag);
        }
        ausgabe.elternGeld = round(elterngeld);
        ausgabe.mehrlingsZulage = round(Big(mehrlingszuschlag));
        ausgabe.geschwisterBonus = round(geschwisterbonus);
      }
      ausgabeLebensmonate.push(ausgabe);
    }

    if (ergebnis.ersatzRate == null) {
      ergebnis.ersatzRate = round(z.ersatzRate);
    }
    ergebnis.elternGeldBasis = round(basiselterngeld);
    ergebnis.elternGeldErwBasis = round(basiselterngeld_erw);
    ergebnis.elternGeldKeineEtPlus = round(elterngeldplus);
    ergebnis.elternGeldEtPlus = round(elterngeldplus_erw);
    ergebnis.mehrlingsZulage = round(z.mehrlingsZulage);
    ergebnis.geschwisterBonus = round(z.geschwisterBonus);
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
      // TODO TW message entfernen
      ergebnis.message =
        "Während des Bezugs des Partnerschaftsbonus muss Erwerbstätigkeit vorliegen.";
      ergebnis.bruttoBasis = BIG_ZERO;
      ergebnis.nettoBasis = BIG_ZERO;
      ergebnis.elternGeldErwBasis = BIG_ZERO;
      ergebnis.bruttoPlus = BIG_ZERO;
      ergebnis.nettoPlus = BIG_ZERO;
      ergebnis.elternGeldEtPlus = BIG_ZERO;
      ergebnis.elternGeldKeineEtPlus = BIG_ZERO;
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
