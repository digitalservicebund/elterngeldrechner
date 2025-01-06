import Big from "big.js";
import {
  AverageOrMonthlyState,
  Taetigkeit,
  Zeitraum,
} from "./stepEinkommenSlice";
import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { YesNo } from "./yes-no";
import { RootState } from "./index";
import { BIG_ZERO } from "@/globals/js/calculations/common/math-util";
import {
  Einkommen,
  ErwerbsTaetigkeit,
  ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
  MischEkTaetigkeit,
  RentenArt,
  SteuerKlasse,
} from "@/globals/js/calculations/model";
import { ElternteilType } from "@/redux/elternteil-type";

const averageFromAverageOrMonthly = (
  averageOrMonthly: AverageOrMonthlyState,
): number => {
  switch (averageOrMonthly.type) {
    case "average":
      return averageOrMonthly.average ?? 0;
    case "monthly":
      return (
        averageOrMonthly.perMonth
          .map((value) => value ?? 0)
          .reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            0,
          ) / averageOrMonthly.perMonth.length
      );
    case "yearly":
      return (averageOrMonthly.perYear ?? 0) / 12;
  }
};

const ANZAHL_MONATE_PRO_JAHR = 12;

const mischEinkommenTaetigkeitenOf = (taetigkeiten: Taetigkeit[]) =>
  taetigkeiten
    .map((taetigkeit) => {
      const mischEinkommenTaetigkeiten = new MischEkTaetigkeit();

      if (taetigkeit.artTaetigkeit === "Selbststaendig") {
        mischEinkommenTaetigkeiten.erwerbsTaetigkeit =
          ErwerbsTaetigkeit.SELBSTSTAENDIG;
      }
      if (taetigkeit.isMinijob === YesNo.YES) {
        mischEinkommenTaetigkeiten.erwerbsTaetigkeit =
          ErwerbsTaetigkeit.MINIJOB;
      }

      mischEinkommenTaetigkeiten.bruttoEinkommenDurchschnitt = Big(
        taetigkeit.bruttoEinkommenDurchschnitt ?? BIG_ZERO,
      );
      mischEinkommenTaetigkeiten.istRentenVersicherungsPflichtig =
        taetigkeit.versicherungen.hasRentenversicherung;
      mischEinkommenTaetigkeiten.istKrankenVersicherungsPflichtig =
        taetigkeit.versicherungen.hasKrankenversicherung;
      mischEinkommenTaetigkeiten.istArbeitslosenVersicherungsPflichtig =
        taetigkeit.versicherungen.hasArbeitslosenversicherung;

      mischEinkommenTaetigkeiten.bemessungsZeitraumMonate = Array.from(
        { length: ANZAHL_MONATE_PRO_JAHR },
        (_, monthIndex) => {
          const taetigkeitHasZeitraumIncludingThisMonth =
            taetigkeit.zeitraum.some(({ from, to }) => {
              const indexStart = Number.parseInt(from) - 1;
              const indexEnd = Number.parseInt(to) - 1;
              return monthIndex >= indexStart && monthIndex <= indexEnd;
            });

          return taetigkeitHasZeitraumIncludingThisMonth;
        },
      );

      return mischEinkommenTaetigkeiten;
    })
    .filter((value) => value.getAnzahlBemessungsZeitraumMonate() > 0);

const erwerbsZeitraumLebensMonatListOf = (
  bruttoEinkommenZeitraumList: BruttoEinkommenZeitraum[],
) =>
  bruttoEinkommenZeitraumList.map(
    (bruttoEinkommenZeitraum) =>
      new ErwerbsZeitraumLebensMonat(
        Number.parseInt(bruttoEinkommenZeitraum.zeitraum.from),
        Number.parseInt(bruttoEinkommenZeitraum.zeitraum.to),
        new Einkommen(bruttoEinkommenZeitraum.bruttoEinkommen ?? 0),
      ),
  );

export const finanzDatenOfUi = (
  state: RootState,
  elternteil: ElternteilType,
  bruttoEinkommenZeitraumSanitized: BruttoEinkommenZeitraum[],
): FinanzDaten => {
  const finanzDaten = new FinanzDaten();

  const stateErwerbsTaetigkeit = state.stepErwerbstaetigkeit[elternteil];
  const isOnlySelbstaendig =
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      stateErwerbsTaetigkeit,
    );
  const isSelbstaendigAndErwerbstaetig =
    stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      stateErwerbsTaetigkeit,
    );
  const mehrereEinkommen =
    stateErwerbsTaetigkeit.mehrereTaetigkeiten === YesNo.YES;
  const isMiniJob = stateErwerbsTaetigkeit.monatlichesBrutto === "MiniJob";

  let bruttoEinkommenBeforeBirth = 0;
  if (
    stateErwerbsTaetigkeit.isNichtSelbststaendig &&
    !isSelbstaendigAndErwerbstaetig
  ) {
    bruttoEinkommenBeforeBirth = averageFromAverageOrMonthly(
      state.stepEinkommen[elternteil].bruttoEinkommenNichtSelbstaendig,
    );
  }
  if (isOnlySelbstaendig && !isMiniJob) {
    bruttoEinkommenBeforeBirth = averageFromAverageOrMonthly(
      state.stepEinkommen[elternteil].gewinnSelbstaendig,
    );
  }

  finanzDaten.bruttoEinkommen = new Einkommen(bruttoEinkommenBeforeBirth);
  finanzDaten.istKirchensteuerpflichtig =
    state.stepEinkommen[elternteil].zahlenSieKirchenSteuer === YesNo.YES
      ? true
      : false;
  finanzDaten.kinderFreiBetrag =
    state.stepEinkommen[elternteil].kinderFreiBetrag ?? KinderFreiBetrag.ZKF0;
  finanzDaten.steuerKlasse =
    state.stepEinkommen[elternteil].steuerKlasse ?? SteuerKlasse.SKL1;
  finanzDaten.kassenArt =
    state.stepEinkommen[elternteil].kassenArt ??
    KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  finanzDaten.rentenVersicherung =
    state.stepEinkommen[elternteil].rentenVersicherung ??
    RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  finanzDaten.splittingFaktor =
    state.stepEinkommen[elternteil].splittingFaktor ?? 1.0;

  if (isSelbstaendigAndErwerbstaetig || mehrereEinkommen) {
    finanzDaten.mischEinkommenTaetigkeiten = mischEinkommenTaetigkeitenOf(
      state.stepEinkommen[elternteil]
        .taetigkeitenNichtSelbstaendigUndSelbstaendig,
    );
  }

  finanzDaten.erwerbsZeitraumLebensMonatList = erwerbsZeitraumLebensMonatListOf(
    bruttoEinkommenZeitraumSanitized,
  );

  return finanzDaten;
};

interface BruttoEinkommenZeitraum {
  bruttoEinkommen: number | null;
  zeitraum: Zeitraum;
}
