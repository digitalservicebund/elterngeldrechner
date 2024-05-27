import { NurErwerbstaetig } from "./NurErwerbstaetig";
import { NurSelbstaendig } from "./NurSelbstaendig";
import { SteuerUndVersicherung } from "./SteuerUndVersicherung";
import { SelbstaendigAndErwerbstaetig } from "./SelbstaendigAndErwerbstaetig";
import { useAppSelector } from "@/redux/hooks";
import type { ElternteilType } from "@/monatsplaner";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";
import { P } from "@/components/atoms";
import { stepErwerbstaetigkeitElternteilSelectors } from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";

const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}. Monat`,
  value: `${index + 1}`,
}));

interface Props {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
}

export function EinkommenFormElternteil({ elternteil, elternteilName }: Props) {
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

      {!!isErwerbstaetigVorGeburt && (
        <>
          {!!isOnlyErwerbstaetigWithOneTaetigkeit && (
            <NurErwerbstaetig
              elternteil={elternteil}
              monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
            />
          )}

          {!!isOnlySelbstaendig && (
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

          {!!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
            <SelbstaendigAndErwerbstaetig
              elternteil={elternteil}
              isSelbststaendig={isSelbststaendig}
              monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
            />
          )}
        </>
      )}
    </section>
  );
}
