import {
  summeSteuer,
  summe_svb_misch,
} from "./brutto-netto-rechner/brutto-netto-rechner";
import { berechneBasiselterngeld } from "./einkommensersatzleistung";
import {
  ErwerbsArt,
  ErwerbsTaetigkeit,
  FinanzDaten,
  Geburtstag,
  KassenArt,
  MischEkZwischenErgebnis,
  PersoenlicheDaten,
  RentenArt,
  SteuerKlasse,
} from "./model";
import {
  berechneUebergangszonenentgeld,
  istArbeitsentgeldImUebergangsbereich,
} from "./sozialabgaben/EinkommenImUebergangsbereich";
import { ermittelGeringfuegigkeitsgrenze } from "./sozialabgaben/Geringfuegigkeitsgrenze";
import { bestimmeWerbekostenpauschale } from "./werbekostenpauschale";
import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";

const ANZAHL_MONATE_PRO_JAHR: number = 12;

export function berechneMischNettoUndBasiselterngeld(
  persoenlicheDaten: PersoenlicheDaten,
  finanzDaten: FinanzDaten,
): MischEkZwischenErgebnis {
  let netto = 0;
  let steuern = 0;
  let abgaben = 0;
  finanzDaten.mischEinkommenTaetigkeiten.forEach((mischEkTaetigkeit) => {
    const { bruttoEinkommenDurchschnitt, erwerbsTaetigkeit } =
      mischEkTaetigkeit;
    const istNichtSelbstaendig =
      erwerbsTaetigkeit === ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG;
    const istMidiJob = istArbeitsentgeldImUebergangsbereich(
      bruttoEinkommenDurchschnitt,
      FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
    );

    if (istMidiJob && istNichtSelbstaendig)
      mischEkTaetigkeit.bruttoEinkommenDurchschnittMidi =
        berechneUebergangszonenentgeld(
          bruttoEinkommenDurchschnitt,
          FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
        );
  });

  let betrachtungsmonate: number = 0;
  let letzter_Betrachtungsmonat: number = 0;
  let zaehler_Pauschmonate: number = 0;
  const monate_pausch: number[] = new Array<number>(12).fill(0);
  for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
    let tmpBetrachtungsmonateFlag: boolean = false;

    const array = finanzDaten.mischEinkommenTaetigkeiten;
    for (const mischEkTaetigkeit of array) {
      if (mischEkTaetigkeit.bemessungsZeitraumMonate[i]) {
        tmpBetrachtungsmonateFlag = true;
      }
      if (
        mischEkTaetigkeit.bemessungsZeitraumMonate[i] &&
        mischEkTaetigkeit.erwerbsTaetigkeit !==
          ErwerbsTaetigkeit.SELBSTSTAENDIG &&
        monate_pausch[i] === 0
      ) {
        zaehler_Pauschmonate++;
        monate_pausch[i] = 1;
      }
    }

    if (tmpBetrachtungsmonateFlag) {
      betrachtungsmonate++;
      letzter_Betrachtungsmonat = i;
    }
  }
  let summe_EK_SS = 0;
  let summe_EK_NS = 0;
  let summe_EK_NS_SV = 0;
  let summe_EK_GNS = 0;
  const array = finanzDaten.mischEinkommenTaetigkeiten;
  for (const mischEkTaetigkeit of array) {
    const anzahlBemessungszeitraumMonate =
      mischEkTaetigkeit.bemessungsZeitraumMonate.filter(
        (value) => value,
      ).length;

    const { bruttoEinkommenDurchschnitt, bruttoEinkommenDurchschnittMidi } =
      mischEkTaetigkeit;

    const bruttoGesamt =
      bruttoEinkommenDurchschnitt * anzahlBemessungszeitraumMonate;

    switch (mischEkTaetigkeit.erwerbsTaetigkeit) {
      case ErwerbsTaetigkeit.SELBSTSTAENDIG:
        summe_EK_SS += bruttoGesamt;
        break;
      case ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG:
        summe_EK_NS += bruttoGesamt;
        if (bruttoEinkommenDurchschnittMidi === 0) {
          summe_EK_NS_SV += +bruttoGesamt;
        } else if (bruttoEinkommenDurchschnittMidi > 0) {
          summe_EK_NS_SV +=
            bruttoEinkommenDurchschnittMidi * anzahlBemessungszeitraumMonate;
        }
        break;
      case ErwerbsTaetigkeit.MINIJOB:
        summe_EK_GNS += +bruttoGesamt;
        break;
    }
  }

  const werbekostenpauschale = bestimmeWerbekostenpauschale(
    persoenlicheDaten.geburtstagDesKindes,
  );
  const brutto_elg = aufDenCentRunden(
    (summe_EK_SS +
      summe_EK_NS +
      summe_EK_GNS -
      zaehler_Pauschmonate * werbekostenpauschale) /
      ANZAHL_MONATE_PRO_JAHR,
  );
  const brutto_steuer = aufDenCentRunden(
    (summe_EK_SS + summe_EK_NS) / ANZAHL_MONATE_PRO_JAHR,
  );
  const brutto_sv = aufDenCentRunden(
    (summe_EK_SS + summe_EK_NS_SV) / ANZAHL_MONATE_PRO_JAHR,
  );
  const betrachtungszeitraumRV: boolean[] = [];
  const betrachtungszeitraumKV: boolean[] = [];
  const betrachtungszeitraumAV: boolean[] = [];
  for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
    betrachtungszeitraumRV.push(false);
    betrachtungszeitraumKV.push(false);
    betrachtungszeitraumAV.push(false);
    {
      const array = finanzDaten.mischEinkommenTaetigkeiten;
      for (const mischEkTaetigkeit of array) {
        if (
          mischEkTaetigkeit.bemessungsZeitraumMonate[i] &&
          mischEkTaetigkeit.erwerbsTaetigkeit !== ErwerbsTaetigkeit.MINIJOB
        ) {
          if (mischEkTaetigkeit.istRentenVersicherungsPflichtig) {
            betrachtungszeitraumRV[i] = true;
          }
          if (mischEkTaetigkeit.istKrankenVersicherungsPflichtig) {
            betrachtungszeitraumKV[i] = true;
          }
          if (mischEkTaetigkeit.istArbeitslosenVersicherungsPflichtig) {
            betrachtungszeitraumAV[i] = true;
          }
        }
      }
    }
  }
  const betrachtungsmonate_grenze = betrachtungsmonate / 2;
  let anzahl_monate_rv = 0;
  let anzahl_monate_kv = 0;
  let anzahl_monate_av = 0;
  for (let i: number = 0; i < ANZAHL_MONATE_PRO_JAHR; i++) {
    if (betrachtungszeitraumRV[i]) {
      anzahl_monate_rv += 1;
    }
    if (betrachtungszeitraumKV[i]) {
      anzahl_monate_kv += 1;
    }
    if (betrachtungszeitraumAV[i]) {
      anzahl_monate_av += 1;
    }
  }
  let rentenversicherungspflichtig: number = 0;
  let krankenversicherungspflichtig: number = 0;
  let arbeitslosenversicherungspflichtig: number = 0;
  if (anzahl_monate_rv > betrachtungsmonate_grenze) {
    rentenversicherungspflichtig = 1;
  }
  if (
    anzahl_monate_rv === betrachtungsmonate_grenze &&
    betrachtungszeitraumRV[letzter_Betrachtungsmonat]
  ) {
    rentenversicherungspflichtig = 1;
  }
  if (anzahl_monate_kv > betrachtungsmonate_grenze) {
    krankenversicherungspflichtig = 1;
  }
  if (
    anzahl_monate_kv === betrachtungsmonate_grenze &&
    betrachtungszeitraumKV[letzter_Betrachtungsmonat]
  ) {
    krankenversicherungspflichtig = 1;
  }
  if (anzahl_monate_av > betrachtungsmonate_grenze) {
    arbeitslosenversicherungspflichtig = 1;
  }
  if (
    anzahl_monate_av === betrachtungsmonate_grenze &&
    betrachtungszeitraumAV[letzter_Betrachtungsmonat]
  ) {
    arbeitslosenversicherungspflichtig = 1;
  }
  let status: ErwerbsArt = ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI;
  if (
    rentenversicherungspflichtig +
      krankenversicherungspflichtig +
      arbeitslosenversicherungspflichtig ===
    0
  ) {
    status = ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
  }
  if (summe_EK_SS > summe_EK_NS + summe_EK_GNS) {
    status = ErwerbsArt.JA_SELBSTSTAENDIG;
  }

  const geringfuegigkeitsgrenze = ermittelGeringfuegigkeitsgrenze(
    FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
  );

  if (
    brutto_elg <= geringfuegigkeitsgrenze &&
    status !== ErwerbsArt.JA_SELBSTSTAENDIG
  ) {
    status = ErwerbsArt.JA_NICHT_SELBST_MINI;
  }
  persoenlicheDaten.etVorGeburt = status;
  if (rentenversicherungspflichtig === 1) {
    finanzDaten.rentenVersicherung = RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  }
  if (krankenversicherungspflichtig === 1) {
    finanzDaten.kassenArt = KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  }
  if (status === ErwerbsArt.JA_NICHT_SELBST_MINI) {
    netto = brutto_elg;
  } else {
    if (status === ErwerbsArt.JA_SELBSTSTAENDIG) {
      finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
      finanzDaten.splittingFaktor = 1.0;
    }
    if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4) {
      finanzDaten.splittingFaktor = 1.0;
    }
    if (finanzDaten.steuerKlasse === SteuerKlasse.SKL4_FAKTOR) {
      finanzDaten.steuerKlasse = SteuerKlasse.SKL4;
    }
    const summe_sozab = summe_svb_misch(
      krankenversicherungspflichtig > 0,
      rentenversicherungspflichtig > 0,
      status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
      brutto_sv,
    );
    const summe_steuer_abzug = summeSteuer(
      finanzDaten,
      status,
      brutto_steuer,
      persoenlicheDaten.geburtstagDesKindes,
    );
    netto = brutto_elg - summe_steuer_abzug - summe_sozab;
    steuern = summe_steuer_abzug;
    abgaben = summe_sozab;
  }
  const ek_vor = netto;
  const elterngeldbasis = berechneBasiselterngeld(ek_vor);
  return {
    krankenversicherungspflichtig: krankenversicherungspflichtig === 1,
    rentenversicherungspflichtig: rentenversicherungspflichtig === 1,
    netto: netto,
    brutto: brutto_elg,
    steuern: steuern,
    abgaben: abgaben,
    elterngeldbasis: elterngeldbasis,
    status: status,
  };
}

/**
 * In the past, the Elterngeldrechner was designed with static calculation
 * parameters (e.g. Geringfügigkeitsgrenze). This does not reflect the reality,
 * nor the regulations. During the period of remodeling work, there has to be
 * a compromise. The revised low level modules are already aware of historic
 * changes. However, the "old" higher level algorithm is not yet capable to
 * integrate with that. Therefore, it temporarily falls back to a fixed point in
 * time again. Just very explicitly this time. At the point in time this code is
 * written we mark the year 2025. The Bemessungszeitraum lies within 2024 for
 * the majority of our current users. Therefore the 1st of January 2024 should
 * be the reference date. Additionally, till today no relevant parameter has
 * changed since then. So this Zeitpunkt is also fully valid for
 * Bemessungszeiträume which span into 2025 as well. In result, the absolute
 * vast majority of our users are covered correctly by this temporal solution.
 */
const FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS = new Date(
  "2024-01-01T00:00:00.000Z",
);

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("basis-eg-algorithmus", async () => {
    const { Einkommen, KinderFreiBetrag } = await import("./model");

    describe("should calculate MischNettoUndBasiselterngeld for test cases from Testfaelle_010219.xlsx", () => {
      it("TESTFALL NO. 1", () => {
        // given
        const persoenlicheDaten = {
          geburtstagDesKindes: new Geburtstag("2023-01-01"),
          anzahlKuenftigerKinder: 1,
          etVorGeburt: ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
          hasEtNachGeburt: false,
          geschwister: [],
        };

        const finanzDaten: FinanzDaten = {
          istKirchensteuerpflichtig: false,
          bruttoEinkommen: new Einkommen(0),
          kinderFreiBetrag: KinderFreiBetrag.ZKF1,
          steuerKlasse: SteuerKlasse.SKL5,
          kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
          rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
          splittingFaktor: 1.0,
          erwerbsZeitraumLebensMonatList: [],
          mischEinkommenTaetigkeiten: [
            {
              erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
              bruttoEinkommenDurchschnitt: 2015.0,
              bruttoEinkommenDurchschnittMidi: 0,
              bemessungsZeitraumMonate: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                false,
              ],
              istRentenVersicherungsPflichtig: false,
              istKrankenVersicherungsPflichtig: true,
              istArbeitslosenVersicherungsPflichtig: false,
            },
            {
              erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
              bruttoEinkommenDurchschnitt: 2343.0,
              bruttoEinkommenDurchschnittMidi: 0,
              bemessungsZeitraumMonate: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                true,
                true,
                false,
                false,
                false,
              ],
              istRentenVersicherungsPflichtig: false,
              istKrankenVersicherungsPflichtig: false,
              istArbeitslosenVersicherungsPflichtig: false,
            },
            {
              erwerbsTaetigkeit: ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG,
              bruttoEinkommenDurchschnitt: 553.0,
              bruttoEinkommenDurchschnittMidi: 0,
              bemessungsZeitraumMonate: [
                false,
                false,
                false,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
                true,
              ],
              istRentenVersicherungsPflichtig: false,
              istKrankenVersicherungsPflichtig: false,
              istArbeitslosenVersicherungsPflichtig: true,
            },
          ],
        };

        // when
        const mischEkZwischenErgebnis = berechneMischNettoUndBasiselterngeld(
          persoenlicheDaten,
          finanzDaten,
        );

        // then
        expect(mischEkZwischenErgebnis.netto).toBe(898.17);
        expect(mischEkZwischenErgebnis.elterngeldbasis).toBe(646.68);
        expect(mischEkZwischenErgebnis.status).toBe(
          ErwerbsArt.JA_SELBSTSTAENDIG,
        );
        expect(mischEkZwischenErgebnis.rentenversicherungspflichtig).toBe(
          false,
        );
        expect(mischEkZwischenErgebnis.krankenversicherungspflichtig).toBe(
          false,
        );
      });
    });
  });
}
