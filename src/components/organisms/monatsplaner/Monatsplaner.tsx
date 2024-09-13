import { ReactNode, useEffect, useRef, useState } from "react";
import classNames from "classnames";
import {
  ElterngeldType,
  ElternteilType,
  validateElternteile,
} from "@/monatsplaner";
import {
  monatsplanerActions,
  monatsplanerSelectors,
} from "@/redux/monatsplanerSlice";
import {
  createAppSelector,
  useAppDispatch,
  useAppSelector,
} from "@/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";
import { ElterngeldRowsResult } from "@/redux/stepRechnerSlice";
import { NotificationValidationMonatsplaner, Toast } from "@/components/atoms";
import { AmountElterngeldRow, Elternteil } from "@/components/molecules";
import nsp from "@/globals/js/namespace";
import { EgrConst } from "@/globals/js/egr-configuration";
import { YesNo } from "@/globals/js/calculations/model";
import {
  canNotChangeBEGDueToSimultaneousMonthRules,
  canNotChangeBEGDueToLimitReachedPerParent,
  canNotChangeEGPDueToLimitReachedPerParent,
} from "@/monatsplaner/elternteile/change-month";

export type ColumnType = Omit<ElterngeldType, "None">;

interface Props {
  readonly mutterSchutzMonate: number;
}

interface LastToggledElterngeldType {
  targetType: ElterngeldType;
  targetColumnType: ColumnType;
}

const emptyAmountElterngeldRows = Array.from<AmountElterngeldRow>({
  length: EgrConst.lebensMonateMaxNumber,
}).fill("empty");

const getAmountElterngeldRow = (
  result: ElterngeldRowsResult,
): AmountElterngeldRow[] => {
  if (result.state !== "success") {
    return emptyAmountElterngeldRows;
  }

  return emptyAmountElterngeldRows.map((_, index) => {
    const lebensmonat = index + 1;
    const resultRow = result.data.find(
      (row) =>
        lebensmonat >= row.vonLebensMonat && lebensmonat <= row.bisLebensMonat,
    );
    if (!resultRow) return "empty";

    return {
      amountBasiselterngeld: resultRow.basisElternGeld,
      amountElterngeldPlus: resultRow.elternGeldPlus,
    };
  });
};

export function Monatsplaner({ mutterSchutzMonate }: Props) {
  const dispatch = useAppDispatch();

  const partnerMonate = useAppSelector(
    (state) => state.monatsplaner.partnerMonate,
  );
  const lebensmonate = useAppSelector(
    stepNachwuchsSelectors.getLebensmonateAfterBirth,
  );
  const elternteile = useAppSelector((state) => state.monatsplaner.elternteile);
  const elternteilNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );
  const antragstellende = useAppSelector(
    (state) => state.stepAllgemeineAngaben.antragstellende,
  );
  const selectablePSBMonths = useAppSelector(
    monatsplanerSelectors.getSelectablePSBMonthIndices,
  );
  const mutterschutzElternteil = useAppSelector(
    (state) => state.monatsplaner.mutterschutzElternteil,
  );
  const amountElterngeldRowsET1 = useAppSelector(
    createAppSelector(
      (state) => state.stepRechner.ET1.elterngeldResult,
      getAmountElterngeldRow,
    ),
  );
  const amountElterngeldRowsET2 = useAppSelector(
    createAppSelector(
      (state) => state.stepRechner.ET2.elterngeldResult,
      getAmountElterngeldRow,
    ),
  );

  const alleinerziehend = useAppSelector(
    (state) => state.stepAllgemeineAngaben.alleinerziehend,
  );

  const elternteileSettings = useAppSelector(
    (state) => state.monatsplaner.settings,
  );

  const [notificationMessages, setNotificationMessages] = useState<
    ReactNode[] | null
  >(null);

  const lastToggledElterngeldTypeRef = useRef<LastToggledElterngeldType>();

  const {
    basiselterngeld: BEGRemainingMonth,
    elterngeldplus: EGPlusRemainingMonth,
  } = elternteile.remainingMonths;

  const onUnMountToast = () => setNotificationMessages(null);

  useEffect(() => {
    const validation = validateElternteile(elternteile);
    const doesNotHaveContinuousEGAfterBEGAnspruch =
      validation &&
      !validation.isValid &&
      validation.errorCodes.includes("DoesNotHaveContinuousEGAfterBEGAnspruch");

    if (doesNotHaveContinuousEGAfterBEGAnspruch) {
      setNotificationMessages([
        <NotificationValidationMonatsplaner
          errorCodes={["DoesNotHaveContinuousEGAfterBEGAnspruch"]}
          key="validation-monatsplaner-does-not-have-continuous-eg-after-beg-anspruch"
        />,
      ]);
    }
  }, [
    BEGRemainingMonth,
    EGPlusRemainingMonth,
    antragstellende,
    elternteile,
    elternteile.ET1.months,
    elternteile.ET2.months,
    alleinerziehend,
  ]);

  const handleToggleMonth = (
    elternteil: ElternteilType,
    columnType: ColumnType,
    monthIndex: number,
  ) => {
    const targetType = (
      elternteile[elternteil].months[monthIndex].type === columnType
        ? "None"
        : columnType
    ) as ElterngeldType;

    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex,
      }),
    );

    lastToggledElterngeldTypeRef.current = {
      targetType,
      targetColumnType: columnType,
    };
  };

  const handleDragOver = (
    elternteil: ElternteilType,
    columnType: ColumnType,
    monthIndex: number,
  ) => {
    if (!lastToggledElterngeldTypeRef.current) return;

    const { targetType, targetColumnType } =
      lastToggledElterngeldTypeRef.current;
    if (columnType !== targetColumnType) return;

    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex,
      }),
    );
  };

  function isBEGMonthSelectable(
    elternteil: ElternteilType,
    monthIndex: number,
  ): boolean {
    const lastPossibleMonthIndex = partnerMonate ? 13 : 11;
    const isInValidRange = monthIndex <= lastPossibleMonthIndex;
    const moreMonthsAvailable = elternteile.remainingMonths.basiselterngeld > 0;
    const changeMonthSettings = {
      targetType: "BEG" as ElterngeldType,
      elternteil,
      monthIndex,
    };
    const isBlockedBySimulataneousMonth =
      canNotChangeBEGDueToSimultaneousMonthRules(
        changeMonthSettings,
        elternteile,
        elternteileSettings,
      );
    const isBlockedByLimitReached = canNotChangeBEGDueToLimitReachedPerParent(
      changeMonthSettings,
      elternteile,
      elternteileSettings,
    );

    return (
      moreMonthsAvailable &&
      isInValidRange &&
      !isBlockedBySimulataneousMonth &&
      !isBlockedByLimitReached
    );
  }

  function isEGPMonthSelectable(
    elternteil: ElternteilType,
    monthIndex: number,
  ): boolean {
    const changeMonthSettings = {
      targetType: "EG+" as ElterngeldType,
      elternteil,
      monthIndex,
    };

    const isBlockedByLimitReached = canNotChangeEGPDueToLimitReachedPerParent(
      changeMonthSettings,
      elternteile,
      elternteileSettings,
    );

    return !isBlockedByLimitReached;
  }

  return (
    <>
      <div
        className={classNames(
          nsp("monatsplaner"),
          alleinerziehend === YesNo.YES && nsp("monatsplaner--alleinerziehend"),
        )}
      >
        <div className={nsp("monatsplaner__header")}>
          <h2 tabIndex={-1} className="mb-10">
            Monatsplaner
          </h2>
          <p>
            Im Monatsplaner können Sie Ihre individuelle Kombination von
            Elterngeld für jeden Lebensmonat Ihres Kindes planen. In der Tabelle
            unten können Sie durch anklicken des jeweiligen Monats wählen, wann
            Sie welches Elterngeld bekommen möchten. Darüber sehen Sie jeweils
            wie viele Monate Sie noch zur Verfügung haben.
          </p>
        </div>

        <div>
          <div className={nsp("monatsplaner__tables")}>
            <Elternteil
              className={nsp("monatsplaner__sticky-elternteil")}
              elternteil={elternteile.ET1}
              selectablePSBMonths={selectablePSBMonths}
              elternteilName={
                alleinerziehend === YesNo.YES ? "" : elternteilNames.ET1
              }
              onToggleMonth={(columnType, monthIndex) =>
                handleToggleMonth("ET1", columnType, monthIndex)
              }
              onDragOverMonth={(columnType, monthIndex) =>
                handleDragOver("ET1", columnType, monthIndex)
              }
              isBEGMonthSelectable={(monthIndex: number) =>
                isBEGMonthSelectable("ET1", monthIndex)
              }
              isEGPMonthSelectable={(monthIndex: number) =>
                isEGPMonthSelectable("ET1", monthIndex)
              }
              lebensmonate={lebensmonate}
              amounts={amountElterngeldRowsET1}
              hasMutterschutz={mutterschutzElternteil === "ET1"}
              mutterSchutzMonate={mutterSchutzMonate}
              partnerMonate={partnerMonate}
              remainingMonths={elternteile.remainingMonths}
              isElternteilOne
            />
            {antragstellende === "FuerBeide" && (
              <Elternteil
                className={nsp("monatsplaner__sticky-elternteil")}
                elternteil={elternteile.ET2}
                selectablePSBMonths={selectablePSBMonths}
                elternteilName={elternteilNames.ET2}
                onToggleMonth={(columnType, monthIndex) =>
                  handleToggleMonth("ET2", columnType, monthIndex)
                }
                onDragOverMonth={(columnType, monthIndex) =>
                  handleDragOver("ET2", columnType, monthIndex)
                }
                isBEGMonthSelectable={(monthIndex: number) =>
                  isBEGMonthSelectable("ET2", monthIndex)
                }
                isEGPMonthSelectable={(monthIndex: number) =>
                  isEGPMonthSelectable("ET2", monthIndex)
                }
                lebensmonate={lebensmonate}
                amounts={amountElterngeldRowsET2}
                hasMutterschutz={mutterschutzElternteil === "ET2"}
                mutterSchutzMonate={mutterSchutzMonate}
                partnerMonate={partnerMonate}
                remainingMonths={elternteile.remainingMonths}
                hideLebensmonateOnDesktop
              />
            )}
          </div>
          <div className={nsp("monatsplaner__footer")}>
            <p>
              Dieses Ergebnis ist nicht rechtsverbindlich. Erst nach der Geburt
              Ihres Kindes kann Ihre zuständige Elterngeldstelle eine konkrete
              und rechtsverbindliche Berechnung Ihres Anspruchs vornehmen.
            </p>
            <Toast
              messages={notificationMessages}
              active={
                notificationMessages !== null && notificationMessages.length > 0
              }
              onUnMount={onUnMountToast}
              timeout={4500}
            />
          </div>
        </div>
      </div>
    </>
  );
}
