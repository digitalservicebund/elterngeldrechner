import { abgabenSteuern } from "./egr-steuer-rechner";
import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";
import {
  Einkommen,
  ErwerbsArt,
  FinanzDaten,
  type Geburtstag,
  KassenArt,
  RentenArt,
  SteuerKlasse,
} from "@/elterngeldrechner/model";
import {
  berechneAbzuegeFuerDieArbeitsfoerderung,
  berechneAbzuegeFuerDieKrankenUndPflegeversicherung,
  berechneAbzuegeFuerDieRentenversicherung,
} from "@/elterngeldrechner/sozialabgaben/Abzuege";
import {
  berechneUebergangszonenentgeld,
  istArbeitsentgeldImUebergangsbereich,
} from "@/elterngeldrechner/sozialabgaben/EinkommenImUebergangsbereich";
import { ermittelGeringfuegigkeitsgrenze } from "@/elterngeldrechner/sozialabgaben/Geringfuegigkeitsgrenze";

export function abzuege(
  bruttoProMonat: number,
  finanzDaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  geburtstagDesKindes: Geburtstag,
): number {
  let rentenversicherungspflichtig =
    finanzDaten.rentenVersicherung ===
    RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  let krankenversicherungspflichtig =
    finanzDaten.kassenArt === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    rentenversicherungspflichtig = true;
  }
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
    rentenversicherungspflichtig = false;
    krankenversicherungspflichtig = false;
  }
  // in 2023 only rentenversicherungspflichtig: https://www.dgb.de/schwerpunkt/minijob
  if (erwerbsArt === ErwerbsArt.JA_NICHT_SELBST_MINI) {
    krankenversicherungspflichtig = false;
    rentenversicherungspflichtig = true;
  }

  let steuerKlasse = finanzDaten.steuerKlasse;
  let splittingFaktor = finanzDaten.splittingFaktor;
  if (erwerbsArt === ErwerbsArt.JA_SELBSTSTAENDIG) {
    steuerKlasse = SteuerKlasse.SKL4;
    splittingFaktor = 1.0;
  }

  // TODO Prüfen on diese Zuweisungen nötig und sinnvoll sind, wenn die Methode vom EGR aufgerufen wird.
  finanzDaten.steuerKlasse = steuerKlasse;
  finanzDaten.splittingFaktor = splittingFaktor;

  return berechneSteuernAbgaben(
    finanzDaten,
    krankenversicherungspflichtig,
    rentenversicherungspflichtig,
    erwerbsArt,
    bruttoProMonat,
    geburtstagDesKindes,
  );
}

/**
 * Methode zum Ermitteln des Zwischenergebnisses, wurde aus VB übernommen. Variablen haben identische Namen wie in
 * VB. Soll auch so bleiben.
 */
export function nettoEinkommenZwischenErgebnis(
  finanzdaten: FinanzDaten,
  erwerbsArtVorGeburt: ErwerbsArt,
  geburtstagDesKindes: Geburtstag,
): Einkommen {
  const netto: Einkommen = new Einkommen(0);
  const status: ErwerbsArt = erwerbsArtVorGeburt;
  const brutto = finanzdaten.bruttoEinkommen.value;
  const art_rv: RentenArt = finanzdaten.rentenVersicherung;
  const art_kv: KassenArt = finanzdaten.kassenArt;
  let rentenversicherungspflichtig: boolean;
  let krankenversicherungspflichtig: boolean;
  rentenversicherungspflichtig =
    art_rv === RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  krankenversicherungspflichtig =
    art_kv === KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  if (status === ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI) {
    rentenversicherungspflichtig = false;
    krankenversicherungspflichtig = false;
  }
  if (status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI) {
    rentenversicherungspflichtig = true;
  }
  if (status !== ErwerbsArt.JA_NICHT_SELBST_MINI) {
    const steuerUndAbgaben = berechneSteuernAbgaben(
      finanzdaten,
      krankenversicherungspflichtig,
      rentenversicherungspflichtig,
      status,
      brutto,
      geburtstagDesKindes,
    );
    netto.value = brutto - steuerUndAbgaben;
  } else {
    netto.value = brutto;
  }
  return netto;
}

/**
 * Methode errechnet Abzüge (Lohnsteuer, Kirchensteuer) vom Bruttogehalt.
 */
export function summeSteuer(
  finanzdaten: FinanzDaten,
  erwerbsArt: ErwerbsArt,
  bruttoProMonat: number,
  geburtstagDesKindes: Geburtstag,
): number {
  const charge = abgabenSteuern(
    finanzdaten,
    erwerbsArt,
    bruttoProMonat,
    geburtstagDesKindes,
  );
  const kirchensteuersatz: number = 8;
  let kirchenlohnsteuer = calculateChurchTaxes(kirchensteuersatz, charge.bk);
  kirchenlohnsteuer = aufDenCentRunden(kirchenlohnsteuer);
  let summeSteuer = charge.lstlzz + charge.solzlzz;

  const geringfuegigkeitsgrenze = ermittelGeringfuegigkeitsgrenze(
    FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
  );

  if (bruttoProMonat <= geringfuegigkeitsgrenze) {
    kirchenlohnsteuer = 0;
    summeSteuer = 0;
  }

  return summeSteuer + kirchenlohnsteuer;
}

/**
 * Methode errechnet Abzüge vom Bruttogehalt in Summe (Lohnsteuer, Kirchensteuer und Sozialabgaben).
 */
function berechneSteuernAbgaben(
  finanzdaten: FinanzDaten,
  krankenversicherungspflichtig: boolean,
  rentenversicherungspflichtig: boolean,
  status: ErwerbsArt,
  bruttoProMonat: number,
  geburtstagDesKindes: Geburtstag,
): number {
  const summeAnSteuern = summeSteuer(
    finanzdaten,
    status,
    bruttoProMonat,
    geburtstagDesKindes,
  );
  let summe_sozab = summer_svb(
    krankenversicherungspflichtig,
    rentenversicherungspflichtig,
    status === ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI,
    bruttoProMonat,
  );
  summe_sozab = aufDenCentRunden(summe_sozab);
  return summeAnSteuern + summe_sozab;
}

/**
 * Ermittlung der Sozialversicherungsabgaben in Summe.
 */
function summer_svb(
  istKrankenversicherungspflichtig: boolean,
  istRentenversicherungspflichtig: boolean,
  istArbeitsfoerderungspflichtig: boolean,
  arbeitsentgeld: number,
): number {
  const istMidiJob = istArbeitsentgeldImUebergangsbereich(
    arbeitsentgeld,
    FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
  );

  const bemessungsgrundlage = istMidiJob
    ? berechneUebergangszonenentgeld(
        arbeitsentgeld,
        FIXED_ZEITPUNKT_FOR_HISTORIC_PARAMETERS,
      )
    : arbeitsentgeld;

  return summe_svb_misch(
    istKrankenversicherungspflichtig,
    istRentenversicherungspflichtig,
    istArbeitsfoerderungspflichtig,
    bemessungsgrundlage,
  );
}

export function summe_svb_misch(
  istKrankenversicherungspflichtig: boolean,
  istRentenversicherungspflichtig: boolean,
  istArbeitsfoerderungspflichtig: boolean,
  bemessungsgrundlage: number,
): number {
  const abzuege = [
    istKrankenversicherungspflichtig
      ? berechneAbzuegeFuerDieKrankenUndPflegeversicherung(bemessungsgrundlage)
      : 0,
    istRentenversicherungspflichtig
      ? berechneAbzuegeFuerDieRentenversicherung(bemessungsgrundlage)
      : 0,
    istArbeitsfoerderungspflichtig
      ? berechneAbzuegeFuerDieArbeitsfoerderung(bemessungsgrundlage)
      : 0,
  ];

  return abzuege.reduce((summe, abzug) => summe + abzug, 0);
}

function calculateChurchTaxes(kirchensteuersatz: number, bk: number): number {
  return (bk / 100) * kirchensteuersatz;
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

  describe("brutto-netto-rechner", async () => {
    const { abzuege } = await import("./brutto-netto-rechner");
    const { KinderFreiBetrag, Geburtstag } = await import(
      "@/elterngeldrechner/model"
    );

    it("should calculate test from TestErweiterterAlgorithmus.java", () => {
      // given
      const finanzDaten = {
        bruttoEinkommen: new Einkommen(0),
        steuerKlasse: SteuerKlasse.SKL4,
        kinderFreiBetrag: KinderFreiBetrag.ZKF1,
        kassenArt: KassenArt.GESETZLICH_PFLICHTVERSICHERT,
        rentenVersicherung: RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG,
        splittingFaktor: 1.0,
        mischEinkommenTaetigkeiten: [],
        erwerbsZeitraumLebensMonatList: [],
      };

      // when
      const actual = abzuege(
        2000,
        finanzDaten,
        ErwerbsArt.JA_SELBSTSTAENDIG,
        new Geburtstag("2020-01-01"),
      );

      // then
      expect(actual).toBe(562.66);
    });
  });
}
