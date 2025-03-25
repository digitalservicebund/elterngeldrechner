import { useId } from "react";
import { NurErwerbstaetig } from "./NurErwerbstaetig";
import { NurSelbstaendig } from "./NurSelbstaendig";
import { SelbstaendigAndErwerbstaetig } from "./SelbstaendigAndErwerbstaetig";
import { SteuerUndVersicherung } from "./SteuerUndVersicherung";
import {
  YesNo,
  stepErwerbstaetigkeitElternteilSelectors,
} from "@/application/features/abfrageteil/state";
import type { ElternteilType } from "@/application/features/abfrageteil/state/ElternteilType";
import { stepAllgemeineAngabenSelectors } from "@/application/features/abfrageteil/state/stepAllgemeineAngabenSlice";
import { useAppSelector } from "@/application/redux/hooks";

const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}. Monat`,
  value: `${index + 1}`,
}));

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
};

export function EinkommenFormElternteil({ elternteil, elternteilName }: Props) {
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

  const heading = elternteilName;
  const hasHeading = antragssteller === "FuerBeide";
  const headingIdentifier = useId();

  return (
    <section
      className="flex flex-col gap-32"
      aria-labelledby={hasHeading ? headingIdentifier : undefined}
    >
      {!!hasHeading && <h3 id={headingIdentifier}>{heading}</h3>}

      {!isErwerbstaetigVorGeburt && (
        <p>
          Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben, wird
          für Sie mit dem Mindestsatz gerechnet und Sie müssen keine weiteren
          Angaben zum Einkommen machen.
        </p>
      )}

      {!!isErwerbstaetigVorGeburt && (
        <>
          {!!isOnlyErwerbstaetigWithOneTaetigkeit && (
            <NurErwerbstaetig
              elternteil={elternteil}
              monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
            />
          )}

          {!!isOnlySelbstaendig && <NurSelbstaendig elternteil={elternteil} />}

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
