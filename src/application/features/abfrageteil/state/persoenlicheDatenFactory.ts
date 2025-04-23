import { ElternteilType } from "./ElternteilType";
import { YesNo } from "./YesNo";
import { stepErwerbstaetigkeitElternteilSelectors } from "./stepErwerbstaetigkeitSlice";
import { stepNachwuchsSelectors } from "./stepNachwuchsSlice";
import { RootState } from "@/application/redux";
import {
  ErwerbsArt,
  Geburtstag,
  type PersoenlicheDaten,
} from "@/elterngeldrechner";

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

const geburtstagOf = (dateString: string): Geburtstag => {
  const [day, month, year] = dateString.split(".");
  return new Geburtstag(`${year}-${month}-${day}`);
};

export const persoenlicheDatenOfUi = (
  state: RootState,
  elternteil: ElternteilType,
): PersoenlicheDaten => {
  return {
    geburtstagDesKindes: new Geburtstag(
      stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum(state),
    ),
    anzahlKuenftigerKinder: state.stepNachwuchs.anzahlKuenftigerKinder,
    etVorGeburt: erwerbsTaetigkeitVorGeburtOf(state, elternteil),
    geschwister: state.stepNachwuchs.geschwisterkinder.map((kind) => ({
      geburtstag: geburtstagOf(kind.geburtsdatum),
      istBehindert: kind.istBehindert,
    })),
  };
};
