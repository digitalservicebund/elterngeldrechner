import PersonIcon from "@digitalservicebund/icons/PersonOutline";
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
import { Antragstellende } from "@/application/features/abfrageteil/state/stepAllgemeineAngabenSlice";
import { useAppSelector } from "@/application/redux/hooks";

const MONTHS_BEFORE_BIRTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  label: `${index + 1}. Monat`,
  value: `${index + 1}`,
}));

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragstellende: Antragstellende | null;
};

export function EinkommenFormElternteil({
  elternteil,
  elternteilName,
  antragstellende,
}: Props) {
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

  const heading = elternteilName;
  const hasHeading =
    antragstellende === "FuerBeide" ||
    antragstellende === "FuerBeideUnentschlossen";
  const headingIdentifier = useId();

  return (
    <section aria-labelledby={hasHeading ? headingIdentifier : undefined}>
      {!!hasHeading && (
        <h3 id={headingIdentifier} className="mb-16">
          <PersonIcon className="mr-8" />
          {heading}
        </h3>
      )}

      <div className="flex flex-col gap-56">
        {!isErwerbstaetigVorGeburt && (
          <p>
            {antragstellende === "FuerBeide" ||
            antragstellende === "FuerBeideUnentschlossen" ? (
              <>
                Da Sie für {elternteilName} in den letzten 12 Monaten kein
                Einkommen angegeben haben, wird für {elternteilName} mit dem
                Mindestsatz gerechnet und Sie müssen keine weiteren Angaben zum
                Einkommen machen.
              </>
            ) : (
              <>
                Da Sie in den letzten 12 Monaten kein Einkommen angegeben haben,
                wird für Sie mit dem Mindestsatz gerechnet und Sie müssen keine
                weiteren Angaben zum Einkommen machen.
              </>
            )}
          </p>
        )}

        {!!isErwerbstaetigVorGeburt && (
          <>
            {!!isOnlyErwerbstaetigWithOneTaetigkeit && (
              <NurErwerbstaetig
                elternteil={elternteil}
                elternteilName={elternteilName}
                antragstellende={antragstellende}
                monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
              />
            )}

            {!!isOnlySelbstaendig && (
              <NurSelbstaendig
                elternteilName={elternteilName}
                elternteil={elternteil}
                antragstellende={antragstellende}
              />
            )}

            {!hasMiniJob && (
              <SteuerUndVersicherung
                elternteil={elternteil}
                elternteilName={elternteilName}
                antragstellende={antragstellende}
                isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten={
                  isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten
                }
              />
            )}

            {!!isSelbstaendigAndErwerbstaetigOrMehrereTaetigkeiten && (
              <SelbstaendigAndErwerbstaetig
                elternteil={elternteil}
                elternteilName={elternteilName}
                antragstellende={antragstellende}
                isSelbststaendig={isSelbststaendig}
                monthsBeforeBirth={MONTHS_BEFORE_BIRTH_OPTIONS}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
}
