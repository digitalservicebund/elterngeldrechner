import { DateTime } from "luxon";
import { stepNachwuchsSelectors } from "./stepNachwuchsSlice";
import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { RootState } from "./index";
import { ElternteilType } from "@/globals/js/elternteil-type";
import {
  ErwerbsArt,
  PersoenlicheDaten,
  YesNo,
} from "@/globals/js/calculations/model";

const erwerbsTaetigkeitVorGeburtOf = (
  state: RootState,
  elternteil: ElternteilType,
) => {
  const erwerbsTaetigkeit = state.stepErwerbstaetigkeit[elternteil];

  if (
    erwerbsTaetigkeit.vorGeburt === null ||
    erwerbsTaetigkeit.vorGeburt === YesNo.NO
  ) {
    return ErwerbsArt.NEIN;
  }

  const onlySelbstaendig =
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      erwerbsTaetigkeit,
    );
  if (onlySelbstaendig) {
    return ErwerbsArt.JA_SELBSTSTAENDIG;
  }

  const isMischeinkommen =
    stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      erwerbsTaetigkeit,
    );
  const mehrereEinkommen = erwerbsTaetigkeit.mehrereTaetigkeiten === YesNo.YES;
  if (isMischeinkommen || mehrereEinkommen) {
    return ErwerbsArt.JA_MISCHEINKOMMEN;
  }

  if (erwerbsTaetigkeit.monatlichesBrutto === "MiniJob") {
    return ErwerbsArt.JA_NICHT_SELBST_MINI;
  }

  return erwerbsTaetigkeit.sozialVersicherungsPflichtig === YesNo.YES
    ? ErwerbsArt.JA_NICHT_SELBST_MIT_SOZI
    : ErwerbsArt.JA_NICHT_SELBST_OHNE_SOZI;
};

const dateOf = (date: string): Date => {
  const [day, month, year] = date.split(".");
  const dateTime = DateTime.fromISO(`${year}-${month}-${day}`);
  return dateTime.toJSDate();
};

export const persoenlicheDatenOfUi = (
  state: RootState,
  elternteil: ElternteilType,
): PersoenlicheDaten => {
  const wahrscheinlichesGeburtsdatum =
    stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum(state);
  const persoenlicheDaten = new PersoenlicheDaten(wahrscheinlichesGeburtsdatum);

  persoenlicheDaten.anzahlKuenftigerKinder =
    state.stepNachwuchs.anzahlKuenftigerKinder;

  persoenlicheDaten.etVorGeburt = erwerbsTaetigkeitVorGeburtOf(
    state,
    elternteil,
  );

  const kuenftigeKinder = Array.from(
    { length: state.stepNachwuchs.anzahlKuenftigerKinder },
    (_, index) => ({
      nummer: index + 1,
      geburtsdatum: undefined,
      istBehindert: false,
    }),
  );
  const geschwisterKinder = state.stepNachwuchs.geschwisterkinder.map(
    (kind, index) => ({
      nummer: index + 1 + state.stepNachwuchs.anzahlKuenftigerKinder,
      geburtsdatum: dateOf(kind.geburtsdatum),
      istBehindert: kind.istBehindert,
    }),
  );
  persoenlicheDaten.kinder = [...kuenftigeKinder, ...geschwisterKinder];

  return persoenlicheDaten;
};
