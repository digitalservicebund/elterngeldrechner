import { useId } from "react";
import { NurErwerbstaetig } from "./NurErwerbstaetig";
import { NurSelbstaendig } from "./NurSelbstaendig";
import { SelbstaendigAndErwerbstaetig } from "./SelbstaendigAndErwerbstaetig";
import { SteuerUndVersicherung } from "./SteuerUndVersicherung";
import type { ElternteilType } from "@/redux/elternteil-type";
import { useAppSelector } from "@/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { stepErwerbstaetigkeitElternteilSelectors } from "@/redux/stepErwerbstaetigkeitSlice";
import { YesNo } from "@/redux/yes-no";

const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}. Monat`,
  value: `${index + 1}`,
}));

interface Props {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
}

export function EinkommenFormElternteil({ elternteil, elternteilName }: Props) {
  const stepErwaerbstaetigkeitForElternteil = useAppSelector(
    (state) => state.stepErwerbstaetigkeit[elternteil],
  )!;

  if (!stepErwaerbstaetigkeitForElternteil) {
    throw new Error("Required data of step erwaerbstaetigkeit is missing.");
  }

  const isErwerbstaetigVorGeburt =
    stepErwerbstaetigkeitElternteilSelectors.isErwerbstaetigVorGeburt(
      stepErwaerbstaetigkeitForElternteil,
    );
  const isOnlyErwerbstaetig =
    stepErwerbstaetigkeitElternteilSelectors.isOnlyErwerbstaetig(
      stepErwaerbstaetigkeitForElternteil,
    );

  const isSelbststaendig = stepErwaerbstaetigkeitForElternteil.isSelbststaendig;
  const isMehrereTaetigkeiten =
    stepErwaerbstaetigkeitForElternteil.mehrereTaetigkeiten === YesNo.YES;

  const isSelbstaendigAndErwerbstaetig =
    stepErwerbstaetigkeitElternteilSelectors.isSelbstaendigAndErwerbstaetig(
      stepErwaerbstaetigkeitForElternteil,
    );
  const isOnlySelbstaendig =
    stepErwerbstaetigkeitElternteilSelectors.isOnlySelbstaendig(
      stepErwaerbstaetigkeitForElternteil,
    );

  const hasMiniJob =
    isErwerbstaetigVorGeburt &&
    stepErwaerbstaetigkeitForElternteil.monatlichesBrutto === "MiniJob";

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
              isSelbststaendig={isSelbststaendig!}
              monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
            />
          )}
        </>
      )}
    </section>
  );
}
