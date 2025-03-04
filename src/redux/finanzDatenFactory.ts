import {
  AverageOrMonthlyState,
  Taetigkeit,
  Zeitraum,
} from "./stepEinkommenSlice";
import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { YesNo } from "./yes-no";
import { RootState } from "./index";
import {
  Einkommen,
  ErwerbsTaetigkeit,
  type ErwerbsZeitraumLebensMonat,
  FinanzDaten,
  KassenArt,
  KinderFreiBetrag,
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
      const {
        hasRentenversicherung: istRentenVersicherungsPflichtig,
        hasKrankenversicherung: istKrankenVersicherungsPflichtig,
        hasArbeitslosenversicherung: istArbeitslosenVersicherungsPflichtig,
      } = taetigkeit.versicherungen;
      switch (taetigkeit.artTaetigkeit) {
        case "NichtSelbststaendig": {
          const erwerbsTaetigkeit =
            taetigkeit.isMinijob === YesNo.YES
              ? ErwerbsTaetigkeit.MINIJOB
              : ErwerbsTaetigkeit.NICHT_SELBSTSTAENDIG;

          const bemessungsZeitraumMonate = Array.from(
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

          return {
            erwerbsTaetigkeit,
            bruttoEinkommenDurchschnitt:
              taetigkeit.bruttoEinkommenDurchschnitt ?? 0,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate,
            istRentenVersicherungsPflichtig,
            istKrankenVersicherungsPflichtig,
            istArbeitslosenVersicherungsPflichtig,
          };
        }

        case "Selbststaendig":
          return {
            erwerbsTaetigkeit: ErwerbsTaetigkeit.SELBSTSTAENDIG,
            bruttoEinkommenDurchschnitt:
              (taetigkeit.gewinneinkuenfte ?? 0) / 12,
            bruttoEinkommenDurchschnittMidi: 0,
            bemessungsZeitraumMonate: Array(12).fill(true),
            istRentenVersicherungsPflichtig,
            istKrankenVersicherungsPflichtig,
            istArbeitslosenVersicherungsPflichtig,
          };
      }
    })
    .filter((taetigkeit) =>
      taetigkeit.bemessungsZeitraumMonate.some((value) => value),
    );

const erwerbsZeitraumLebensMonatListOf = (
  bruttoEinkommenZeitraumList: BruttoEinkommenZeitraum[],
): ErwerbsZeitraumLebensMonat[] =>
  bruttoEinkommenZeitraumList.map((bruttoEinkommenZeitraum) => ({
    vonLebensMonat: Number.parseInt(bruttoEinkommenZeitraum.zeitraum.from),
    bisLebensMonat: Number.parseInt(bruttoEinkommenZeitraum.zeitraum.to),
    bruttoProMonat: new Einkommen(bruttoEinkommenZeitraum.bruttoEinkommen ?? 0),
  }));

export const finanzDatenOfUi = (
  state: RootState,
  elternteil: ElternteilType,
  bruttoEinkommenZeitraumSanitized: BruttoEinkommenZeitraum[],
): FinanzDaten => {
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

  const bruttoEinkommen = new Einkommen(bruttoEinkommenBeforeBirth);
  const istKirchensteuerpflichtig =
    state.stepEinkommen[elternteil].zahlenSieKirchenSteuer === YesNo.YES
      ? true
      : false;
  const kinderFreiBetrag =
    state.stepEinkommen[elternteil].kinderFreiBetrag ?? KinderFreiBetrag.ZKF0;
  const steuerKlasse =
    state.stepEinkommen[elternteil].steuerKlasse ?? SteuerKlasse.SKL1;
  const kassenArt =
    state.stepEinkommen[elternteil].kassenArt ??
    KassenArt.GESETZLICH_PFLICHTVERSICHERT;
  const rentenVersicherung =
    state.stepEinkommen[elternteil].rentenVersicherung ??
    RentenArt.GESETZLICHE_RENTEN_VERSICHERUNG;
  const splittingFaktor =
    state.stepEinkommen[elternteil].splittingFaktor ?? 1.0;

  const mischEinkommenTaetigkeiten =
    isSelbstaendigAndErwerbstaetig || mehrereEinkommen
      ? mischEinkommenTaetigkeitenOf(
          state.stepEinkommen[elternteil]
            .taetigkeitenNichtSelbstaendigUndSelbstaendig,
        )
      : [];

  const erwerbsZeitraumLebensMonatList = erwerbsZeitraumLebensMonatListOf(
    bruttoEinkommenZeitraumSanitized,
  );

  return {
    bruttoEinkommen,
    istKirchensteuerpflichtig,
    kinderFreiBetrag,
    steuerKlasse,
    kassenArt,
    rentenVersicherung,
    splittingFaktor,
    mischEinkommenTaetigkeiten,
    erwerbsZeitraumLebensMonatList,
  };
};

interface BruttoEinkommenZeitraum {
  bruttoEinkommen: number | null;
  zeitraum: Zeitraum;
}
