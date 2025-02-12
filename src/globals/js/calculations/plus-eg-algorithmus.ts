import { addMonths, setDate, subDays } from "date-fns";
import { elterngeld_et, elterngeldplus_et } from "./abstract-algorithmus";
import { abzuege } from "./brutto-netto-rechner/brutto-netto-rechner";
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
import { bestimmeWerbekostenpauschale } from "./werbekostenpauschale";
import { aufDenCentRunden } from "@/globals/js/calculations/common/math-util";
import { bruttoEGPlusNeu } from "@/globals/js/calculations/eg-brutto-rechner";
import {
  BETRAG_MEHRLINGSZUSCHLAG,
  MINDESTSATZ,
  MIN_GESCHWISTERBONUS,
  RATE_BONUS,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";

export function elterngeldPlusErgebnis(
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
    ergebnis = ohneETVorGeburt();
  } else {
    ergebnis = mitETVorGeburt(
      planungsergebnis,
      persoenlicheDaten,
      finanzDaten,
      lohnSteuerJahr,
      mischEkZwischenErgebnis,
      z,
    );
  }
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
  const { verlauf, hatPartnerbonus } = determineElternGeldKategorie(
    finanzDatenBerechnet,
    eg_verlauf,
    brutto_LM_Basis,
    brutto_LM_Plus,
    etVorGeburt,
  );
  ergebnis = validateEinkommenPartnerBonus(ergebnis, hatPartnerbonus);
  return createElterngeldAusgabe(
    persoenlicheDaten,
    finanzDaten,
    ergebnis,
    z,
    mischEkZwischenErgebnis,
    verlauf,
    planungsergebnis,
    hatPartnerbonus,
  );
}

function getEKVor(
  finanzDaten: FinanzDaten,
  ek_vor: number,
  mischEkZwischenErgebnis: MischEkZwischenErgebnis | null,
  werbekostenpauschale: number,
): number {
  const isMischeinkommen = finanzDaten.mischEinkommenTaetigkeiten.length > 0;

  if (isMischeinkommen) {
    if (mischEkZwischenErgebnis === null) {
      throw errorOf("MischEinkommenEnabledButMissingMischEinkommen");
    }

    ek_vor = mischEkZwischenErgebnis.netto;
    if (mischEkZwischenErgebnis.status !== ErwerbsArt.JA_SELBSTSTAENDIG) {
      ek_vor = ek_vor + werbekostenpauschale;
    }
  }
  return ek_vor;
}

function ohneETVorGeburt(): ElternGeldPlusErgebnis {
  return {
    elternGeldAusgabe: [],
    ersatzRate: 0,
    etVorGeburt: false,
    geschwisterBonus: 0,
    geschwisterBonusDeadLine: null,
    hasPartnerBonusError: false,
    mehrlingsZulage: 0,
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

function mitETVorGeburt(
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
    const werbekostenpauschale = bestimmeWerbekostenpauschale(
      persoenlicheDaten.wahrscheinlichesGeburtsDatum,
    );
    if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
      throw new Error("wahrscheinlichesGeburtsDatum === undefined");
    }
    const anzahl_monate: number = zaehleMonateErwerbsTaetigkeit(
      finanzDaten.erwerbsZeitraumLebensMonatList,
    );
    if (anzahl_monate != null && anzahl_monate !== 0) {
      let summe_brutto_basis = 0;
      let summe_brutto_plus = 0;
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
      const brutto_LM_Plus = bruttoLMPlus.slice(0);
      const brutto_LM_Basis = bruttoLMBasis.slice(0);
      let steuer_sozab_basis = 0;
      let steuer_sozab_plus = 0;
      brutto_basis = finanzDatenBerechnet.bruttoEinkommenDurch;
      brutto_plus = finanzDatenBerechnet.bruttoEinkommenPlusDurch;
      if (persoenlicheDaten.etVorGeburt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
        netto_basis = brutto_basis;
        netto_plus = brutto_plus;
      } else {
        if (brutto_basis > 0) {
          steuer_sozab_basis = abzuege(
            brutto_basis,
            lohnSteuerJahr,
            finanzDaten,
            persoenlicheDaten.etVorGeburt,
            persoenlicheDaten.wahrscheinlichesGeburtsDatum,
          );
        }
        if (brutto_plus > 0) {
          steuer_sozab_plus = abzuege(
            brutto_plus,
            lohnSteuerJahr,
            finanzDaten,
            persoenlicheDaten.etVorGeburt,
            persoenlicheDaten.wahrscheinlichesGeburtsDatum,
          );
        }
      }
      let ek_vor = z.nettoVorGeburt;
      ek_vor = getEKVor(
        finanzDaten,
        ek_vor,
        mischEkZwischenErgebnis,
        werbekostenpauschale,
      );
      if (brutto_basis > 0) {
        switch (persoenlicheDaten.etVorGeburt) {
          case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
          case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
          case ErwerbsArt.JA_NICHT_SELBST_MINI:
            ek_vor = Math.max(
              aufDenCentRunden(ek_vor - werbekostenpauschale),
              0,
            );
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
                    Math.max(
                      bruttoInLebensmonatenMitBasis - werbekostenpauschale,
                      0,
                    ),
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
          elterngeld_et(ek_vor, ek_nach_basis),
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
        ek_vor = getEKVor(
          finanzDaten,
          ek_vor,
          mischEkZwischenErgebnis,
          werbekostenpauschale,
        );
        switch (status) {
          case ErwerbsArt.JA_NICHT_SELBST_MINI:
          case ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI:
          case ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI:
            ek_vor = Math.max(ek_vor - werbekostenpauschale, 0);
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
                    Math.max(
                      bruttoInLebensmonatenMitPlus - werbekostenpauschale,
                      0,
                    ),
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
        elterngeldplus_et(ek_vor, ek_nach_plus),
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
  };
}

function fillLebensMonateList(geburt: Date): Date[] {
  // Die Arrays anfang_LM wird mit Index 1-32 benutzt.
  const anfang_LM: Date[] = [];

  for (let i: number = 0; i < PLANUNG_ANZAHL_MONATE; i++) {
    const anfang: Date = addMonths(geburt, i);
    const ende: Date = subDays(addMonths(geburt, i + 1), 1);
    anfang_LM[i + 1] = anfang;
    if (
      geburt.getDay() > 28 &&
      anfang.getMonth() === 2 &&
      anfang.getDay() < 5
    ) {
      anfang_LM[i + 1] = setDate(addMonths(geburt, i + 1), 1);
    }
    if (geburt.getDay() > 28 && ende.getMonth() === 2 && ende.getDay() < 5) {
      anfang_LM[i + 1] = subDays(setDate(addMonths(geburt, i + 2), 1), 1);
    }
  }

  return anfang_LM;
}

function determineElternGeldKategorie(
  finanzDatenBerechnet: FinanzDatenBerechnet,
  eg_verlauf: ElternGeldArt[], // Das Array wird mit Index 0-31 benutzt.
  brutto_LM_Basis: number[], // Das Array wird mit Index 1-32 benutzt.
  brutto_LM_Plus: number[], // Das Array wird mit Index 1-32 benutzt.
  etVorGeburt: boolean,
): { verlauf: ElternGeldKategorie[]; hatPartnerbonus: boolean } {
  const verlauf = new Array<ElternGeldKategorie>(PLANUNG_ANZAHL_MONATE);
  let hatPartnerbonus = false;

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
        hatPartnerbonus = true;
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
        hatPartnerbonus = true;
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
  return { verlauf, hatPartnerbonus };
}

function createElterngeldAusgabe(
  persoenlicheDaten: PersoenlicheDaten,
  finanzDaten: FinanzDaten,
  ergebnis: ElternGeldPlusErgebnis,
  z: ZwischenErgebnis,
  misch: MischEkZwischenErgebnis | null,
  verlauf: ElternGeldKategorie[],
  planungsergebnis: PlanungsDaten,
  hatPartnerbonus: boolean,
): ElternGeldPlusErgebnis {
  if (persoenlicheDaten.wahrscheinlichesGeburtsDatum === undefined) {
    throw new Error("wahrscheinlichesGeburtsDatum === undefined");
  }
  const ende_geschwisterbonus: Date | null = z.zeitraumGeschwisterBonus;
  const geschw = new Array<number>(PLANUNG_ANZAHL_MONATE).fill(0);
  const isGeschwisterVorhanden =
    (persoenlicheDaten.geschwister ?? []).length > 0;

  if (isGeschwisterVorhanden) {
    const geburt = persoenlicheDaten.wahrscheinlichesGeburtsDatum;
    const anfang_LM = fillLebensMonateList(geburt);

    for (let i = 1; i <= PLANUNG_ANZAHL_MONATE; i++) {
      if (
        ende_geschwisterbonus != null &&
        ende_geschwisterbonus >= (anfang_LM[i] ?? 0)
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
    if (isMutterschaftsLeistungImMonat(i, planungsergebnis)) {
      ausgabe.mutterschaftsLeistungMonat = true;
    } else if (hatPartnerbonus) {
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
        elterngeld = basiselterngeld_erw + geschwisterbonus + mehrlingszuschlag;
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
          Math.max(min_geschwisterbonus / 2, elterngeldplus_erw * rate_bonus) *
            (geschw[i - 1] ?? 0),
        );
        elterngeld = elterngeldplus_erw + geschwisterbonus + mehrlingszuschlag;
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

function isMutterschaftsLeistungImMonat(
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

function validateEinkommenPartnerBonus(
  ergebnis: ElternGeldPlusErgebnis,
  hatPartnerbonus: boolean,
): ElternGeldPlusErgebnis {
  ergebnis.hasPartnerBonusError = false;
  if (hatPartnerbonus) {
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
    const {
      Einkommen,
      ErwerbsTaetigkeit,
      KassenArt,
      KinderFreiBetrag,
      RentenArt,
      SteuerKlasse,
    } = await import("./model");

    const { elterngeldZwischenergebnis } = await import(
      "./eg-zwischen-ergebnis-algorithmus"
    );

    describe("plus-eg-algorithmus", () => {
      describe("should calculate ElternGeldPlusErgebnis", () => {
        it("Test with 'Erwerbstaetigkeit nach Geburt'", () => {
          // given
          const planungsDaten = {
            mutterschaftsLeistung:
              MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
            planung: new Array<ElternGeldArt>(PLANUNG_ANZAHL_MONATE).fill(
              ElternGeldArt.ELTERNGELD_PLUS,
            ),
          };

          const persoenlicheDaten = {
            wahrscheinlichesGeburtsDatum: new Date("2022-11-24"),
            anzahlKuenftigerKinder: 1,
            etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
            hasEtNachGeburt: true,
          };

          const finanzDaten = {
            ...ANY_FINANZDATEN,
            bruttoEinkommen: new Einkommen(2800),
            steuerKlasse: SteuerKlasse.SKL1,
            kinderFreiBetrag: KinderFreiBetrag.ZKF1,
            erwerbsZeitraumLebensMonatList: [
              {
                vonLebensMonat: 1,
                bisLebensMonat: 2,
                bruttoProMonat: new Einkommen(100),
              },
              {
                vonLebensMonat: 3,
                bisLebensMonat: 4,
                bruttoProMonat: new Einkommen(1000),
              },
              {
                vonLebensMonat: 5,
                bisLebensMonat: 6,
                bruttoProMonat: new Einkommen(5000),
              },
            ],
          };

          const nettoEinkommen = new Einkommen(1883);

          const mischEkZwischenErgebnis = createMischEkZwischenErgebnis();
          const zwischenErgebnis = elterngeldZwischenergebnis(
            persoenlicheDaten,
            nettoEinkommen,
          );

          // when
          const ergebnis = elterngeldPlusErgebnis(
            planungsDaten,
            persoenlicheDaten,
            finanzDaten,
            2022,
            mischEkZwischenErgebnis,
            zwischenErgebnis,
          );

          // then
          expect(ergebnis).not.toBeUndefined();
          expect(ergebnis.bruttoBasis).toBe(0);
          expect(ergebnis.nettoBasis).toBe(0);
          expect(ergebnis.elternGeldErwBasis).toBe(0);
          expect(ergebnis.bruttoPlus).toBe(1950);
          expect(ergebnis.nettoPlus).toBe(1356.84);
          expect(ergebnis.elternGeldEtPlus).toBeCloseTo(287.83, 1);
          expect(ergebnis.elternGeldKeineEtPlus).toBe(584.89);
        });

        it("should throw error, if finanzdaten mischeinkommen are true and MischEkZwischenErgebnis are null", () => {
          // given
          const persoenlicheDaten = {
            wahrscheinlichesGeburtsDatum: new Date("2023-11-24T01:02:03.000Z"),
            anzahlKuenftigerKinder: 1,
            etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
            hasEtNachGeburt: true,
          };

          const zwischenErgebnis: ZwischenErgebnis = {
            elternGeld: 0,
            ersatzRate: 0,
            geschwisterBonus: 0,
            mehrlingsZulage: 0,
            nettoVorGeburt: 0,
            zeitraumGeschwisterBonus: null,
          };

          const finanzDaten = {
            ...ANY_FINANZDATEN,
            mischEinkommenTaetigkeiten: [ANY_MISCHEINKOMMEN_TAETIGKEIT],
          };

          expect(() =>
            elterngeldPlusErgebnis(
              {
                mutterschaftsLeistung:
                  MutterschaftsLeistung.MUTTERSCHAFTS_LEISTUNG_NEIN,
                planung: [],
              },
              persoenlicheDaten,
              finanzDaten,
              2022,
              null,
              zwischenErgebnis,
            ),
          ).toThrow("MischEinkommenEnabledButMissingMischEinkommen");
        });
      });
    });

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

    const createMischEkZwischenErgebnis = (): MischEkZwischenErgebnis => {
      return {
        elterngeldbasis: 0,
        krankenversicherungspflichtig: false,
        netto: 0,
        brutto: 0,
        steuern: 0,
        abgaben: 0,
        rentenversicherungspflichtig: false,
        status: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
      };
    };

    const ANY_EINKOMMEN = new Einkommen(0);

    const ANY_FINANZDATEN = {
      bruttoEinkommen: new Einkommen(0),
      steuerKlasse: SteuerKlasse.SKL1,
      kinderFreiBetrag: KinderFreiBetrag.ZKF0,
      kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
      rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
      splittingFaktor: 1.0,
      mischEinkommenTaetigkeiten: [],
      erwerbsZeitraumLebensMonatList: [],
    };

    const ANY_MISCHEINKOMMEN_TAETIGKEIT = {
      erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
      bruttoEinkommenDurchschnitt: 1000,
      bruttoEinkommenDurchschnittMidi: 0,
      bemessungsZeitraumMonate: [],
    };
  });
}
