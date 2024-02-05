import { RootState } from "./index";
import { ElternteilType } from "@egr/monatsplaner-app";
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
  YesNo,
} from "../globals/js/calculations/model";
import { stepNachwuchsSelectors } from "./stepNachwuchsSlice";
import Big from "big.js";
import { MathUtil } from "../globals/js/calculations/common/math-util";
import { BruttoEinkommenZeitraum } from "./stepRechnerSlice";
import { AverageOrMonthlyState, Taetigkeit } from "./stepEinkommenSlice";
import { SelectOption } from "../components/molecules";
import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { ZeitraumValue } from "../globals/js/ZeitraumValue";

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
          .reduce((accumulator, currentValue) => accumulator + currentValue) /
        averageOrMonthly.perMonth.length
      );
    case "yearly":
      return (averageOrMonthly.perYear ?? 0) / 12;
  }
  throw new Error("Unknown AverageOrMonthlyState Type.");
};

const mischEinkommenTaetigkeitenOf = (
  taetigkeiten: Taetigkeit[],
  monthsBeforeBirth: SelectOption[],
) =>
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
        taetigkeit.bruttoEinkommenDurchschnitt ?? MathUtil.BIG_ZERO,
      );
      mischEinkommenTaetigkeiten.rentenVersicherungsPflichtig = taetigkeit
        .versicherungen.hasRentenversicherung
        ? YesNo.YES
        : YesNo.NO;
      mischEinkommenTaetigkeiten.krankenVersicherungsPflichtig = taetigkeit
        .versicherungen.hasKrankenversicherung
        ? YesNo.YES
        : YesNo.NO;
      mischEinkommenTaetigkeiten.arbeitslosenVersicherungsPflichtig = taetigkeit
        .versicherungen.hasArbeitslosenversicherung
        ? YesNo.YES
        : YesNo.NO;
      mischEinkommenTaetigkeiten.bemessungsZeitraumMonate = monthsBeforeBirth
        .sort(
          (a, b) =>
            ZeitraumValue.valueOf(b.value, "Date") -
            ZeitraumValue.valueOf(a.value, "Date"),
        )
        .map(({ value: monatsDatum }) =>
          taetigkeit.zeitraum.some(
            ({ from, to }) => monatsDatum >= from && monatsDatum <= to,
          ),
        );
      return mischEinkommenTaetigkeiten;
    })
    .filter((value) => value.getAnzahlBemessungsZeitraumMonate() > 0);

const erwerbsZeitraumLebensMonatListOf = (
  bruttoEinkommenZeitraumList: BruttoEinkommenZeitraum[],
) =>
  bruttoEinkommenZeitraumList.map((bruttoEinkommenZeitraum) => {
    const erwerbsZeitraumLebensMonat = new ErwerbsZeitraumLebensMonat();
    erwerbsZeitraumLebensMonat.vonLebensMonat = Number.parseInt(
      bruttoEinkommenZeitraum.zeitraum.from,
    );
    erwerbsZeitraumLebensMonat.bisLebensMonat = Number.parseInt(
      bruttoEinkommenZeitraum.zeitraum.to,
    );

    const bruttoEinkommen = bruttoEinkommenZeitraum.bruttoEinkommen ?? 0;
    erwerbsZeitraumLebensMonat.bruttoProMonat = new Einkommen(bruttoEinkommen);

    return erwerbsZeitraumLebensMonat;
  });

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
  finanzDaten.zahlenSieKirchenSteuer =
    state.stepEinkommen[elternteil].zahlenSieKirchenSteuer ?? YesNo.NO;
  finanzDaten.kinderFreiBetrag =
    state.stepEinkommen[elternteil].kinderFreiBetrag ?? KinderFreiBetrag.ZKF0;
  finanzDaten.steuerKlasse =
    state.stepEinkommen[elternteil].steuerKlasse ?? SteuerKlasse.SKL_UNBEKANNT;
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
      stepNachwuchsSelectors.getMonthsBeforeBirthOptions(state),
    );
  }

  finanzDaten.erwerbsZeitraumLebensMonatList = erwerbsZeitraumLebensMonatListOf(
    bruttoEinkommenZeitraumSanitized,
  );

  return finanzDaten;
};
