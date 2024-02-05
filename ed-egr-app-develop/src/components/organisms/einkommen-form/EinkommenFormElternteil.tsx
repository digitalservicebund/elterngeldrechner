import { VFC } from "react";
import type { ElternteilType } from "@egr/monatsplaner-app";
import { useAppSelector } from "../../../redux/hooks";
import { NurErwerbstaetig } from "./NurErwerbstaetig";
import { NurSelbstaendig } from "./NurSelbstaendig";
import { SteuerUndVersicherung } from "./SteuerUndVersicherung";
import { SelbstaendigAndErwerbstaetig } from "./SelbstaendigAndErwerbstaetig";
import { stepNachwuchsSelectors } from "../../../redux/stepNachwuchsSlice";
import { P } from "../../atoms";
import { stepErwerbstaetigkeitElternteilSelectors } from "../../../redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "../../../globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";

interface Props {
  elternteil: ElternteilType;
  elternteilName: string;
}

export const EinkommenFormElternteil: VFC<Props> = ({
  elternteil,
  elternteilName,
}) => {
  const monthsBeforeBirthOptions = useAppSelector(
    stepNachwuchsSelectors.getMonthsBeforeBirthOptions,
  );
  const monthsLastYearBeforeBirthOptions = useAppSelector(
    stepNachwuchsSelectors.getMonthsLastYearBeforeBirthOptions,
  );
  const isErwerbstaetigVorGeburt = useAppSelector((state) =>
    stepErwerbstaetigkeitElternteilSelectors.isErwerbstaetigVorGeburt(
      state.stepErwerbstaetigkeit[elternteil],
    ),
  );
  const isOnlyErwerbstaetig = useAppSelector((state) =>
    stepErwerbstaetigkeitElternteilSelectors.isOnlyErwerbstaetig(
      state.stepErwerbstaetigkeit[elternteil],
    ),
  );
  const erwerbstaetigkeit = useAppSelector(
    (state) => state.stepErwerbstaetigkeit,
  );

  const isSelbststaendig = erwerbstaetigkeit[elternteil].isSelbststaendig;
  const isMehrereTaetigkeiten =
    erwerbstaetigkeit[elternteil].mehrereTaetigkeiten === YesNo.YES;

  const isSelbstaendigAndErwerbstaetig = useAppSelector((state) =>
    stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      state.stepErwerbstaetigkeit[elternteil],
    ),
  );
  const isOnlySelbstaendig = useAppSelector((state) =>
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      state.stepErwerbstaetigkeit[elternteil],
    ),
  );

  const hasMiniJob = useAppSelector(
    (state) =>
      isErwerbstaetigVorGeburt &&
      state.stepErwerbstaetigkeit[elternteil].monatlichesBrutto === "MiniJob",
  );

  const isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten =
    isSelbstaendigAndErwerbstaetig || isMehrereTaetigkeiten;

  const isOnlyErwerbstaetigWithOneTaetigkeit =
    isOnlyErwerbstaetig && !isMehrereTaetigkeiten;

  const antragssteller = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );

  return (
    <section aria-label={elternteilName}>
      {antragssteller === "FuerBeide" && <h2>{elternteilName}</h2>}
      {!isErwerbstaetigVorGeburt && (
        <P>
          Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben, wird
          für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren
          Angaben zum Einkommen machen.
        </P>
      )}

      {isErwerbstaetigVorGeburt && (
        <>
          {isOnlyErwerbstaetigWithOneTaetigkeit && (
            <NurErwerbstaetig
              elternteil={elternteil}
              monthsBeforeBirth={monthsBeforeBirthOptions}
            />
          )}

          {isOnlySelbstaendig && (
            <NurSelbstaendig
              elternteil={elternteil}
              monthsBeforeBirth={monthsLastYearBeforeBirthOptions}
            />
          )}

          {!hasMiniJob && (
            <SteuerUndVersicherung
              elternteil={elternteil}
              isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten={
                isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten
              }
            />
          )}

          {isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
            <SelbstaendigAndErwerbstaetig
              elternteil={elternteil}
              isSelbststaendig={isSelbststaendig}
              monthsBeforeBirth={monthsBeforeBirthOptions}
            />
          )}
        </>
      )}
    </section>
  );
};
