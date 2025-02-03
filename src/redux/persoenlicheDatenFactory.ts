import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { stepNachwuchsSelectors } from "./stepNachwuchsSlice";
import { YesNo } from "./yes-no";
import { RootState } from "./index";
import { ErwerbsArt, PersoenlicheDaten } from "@/globals/js/calculations/model";
import { ElternteilType } from "@/redux/elternteil-type";

const erwerbsTaetigkeitVorGeburtOf = (
  state: RootState,
  elternteil: ElternteilType,
) => {
  const erwerbsTaetigkeit = state.stepErwerbstaetigkeit[elternteil];

  if (
    erwerbsTaetigkeit == null ||
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
  return new Date(`${year}-${month}-${day}`);
};

export const persoenlicheDatenOfUi = (
  state: RootState,
  elternteil: ElternteilType,
): PersoenlicheDaten => {
  return {
    wahrscheinlichesGeburtsDatum:
      stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum(state),
    anzahlKuenftigerKinder: state.stepNachwuchs.anzahlKuenftigerKinder,
    etVorGeburt: erwerbsTaetigkeitVorGeburtOf(state, elternteil),
    geschwister: state.stepNachwuchs.geschwisterkinder.map((kind) => ({
      geburtsdatum: dateOf(kind.geburtsdatum),
      istBehindert: kind.istBehindert,
    })),
  };
};
