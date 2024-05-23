import { ReactNode, useEffect, useRef, useState } from "react";
import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import AddIcon from "@digitalservicebund/icons/Add";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { SummationFooter } from "./SummationFooter";
import { useSummarizeData } from "./useSummarizeData";
import { usePlanningContingentMonths } from "./usePlanningContingentMonths";
import {
  ElterngeldType,
  Elternteile,
  ElternteilType,
  Month,
  validateElternteile,
} from "@/monatsplaner";
import {
  getAutomaticallySelectedPSBMonthIndex,
  monatsplanerActions,
  monatsplanerSelectors,
} from "@/redux/monatsplanerSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  Antragstellende,
  stepAllgemeineAngabenSelectors,
} from "@/redux/stepAllgemeineAngabenSlice";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";
import {
  ElterngeldRowsResult,
  stepRechnerSelectors,
} from "@/redux/stepRechnerSlice";
import {
  Button,
  NotificationNoFurtherMonthAvailable,
  NotificationPSBAutomaticallySelection,
  NotificationPSBChangeOtherElternteil,
  NotificationPSBNotDeselectable,
  NotificationValidationMonatsplaner,
  NotificationBEGHintMinMax,
  NotificationBEGHintMin,
  NotificationBEGMax,
  P,
  Toast,
} from "@/components/atoms";
import {
  AccessControl,
  AmountElterngeldRow,
  Elternteil,
  PlanningContingent,
} from "@/components/molecules";
import nsp from "@/globals/js/namespace";
import { formSteps } from "@/utils/formSteps";
import { EgrConst } from "@/globals/js/egr-configuration";
import { YesNo } from "@/globals/js/calculations/model";
import {
  canNotChangeBEGDueToSimultaneousMonthRules,
  reachedLimitOfSimultaneousBEGMonths,
  isExceptionToSimulatenousMonthRestrictions,
  canNotChangeBEGDueToLimitReachedPerParent,
  canNotChangeEGPDueToLimitReachedPerParent,
} from "@/monatsplaner/elternteile/change-month";
import { NotificationMaxSimultaneousBEGMonths } from "@/components/atoms/notification/NotificationMaxSimultaneousBEGMonths";

export type ColumnType = Omit<ElterngeldType, "None">;

interface Props {
  mutterSchutzMonate: number;
}

interface LastToggledElterngeldType {
  targetType: ElterngeldType;
  targetColumnType: ColumnType;
}

const initialLebensmonateVisibleLength = 18;

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

const begCountOf = (months: readonly Month[]) =>
  months.filter((month) => month.type === "BEG").length;

const checkForNotificationBEGHintMinMax = (
  elternteile: Elternteile,
  antragstellende: Antragstellende | null,
) => {
  const begEt1 = begCountOf(elternteile.ET1.months);
  const begEt2 = begCountOf(elternteile.ET2.months);
  return (
    antragstellende === "FuerBeide" &&
    ((begEt1 >= 11 && begEt2 <= 1) || (begEt2 >= 11 && begEt1 <= 1))
  );
};

const checkMaxBEG = (
  elternteile: Elternteile,
  antragstellende: Antragstellende | null,
) => {
  const begEt1 = begCountOf(elternteile.ET1.months);
  const begEt2 = begCountOf(elternteile.ET2.months);
  return antragstellende === "FuerBeide" && (begEt1 > 12 || begEt2 > 12);
};

export function Monatsplaner({ mutterSchutzMonate }: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const partnerMonate = useAppSelector(
    (state) => state.monatsplaner.partnerMonate,
  );
  const isMonatsplanerOverlayVisible = useAppSelector(
    stepRechnerSelectors.isMonatsplanerOverlayVisible,
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
  const amountElterngeldRowsET1 = useAppSelector((state) =>
    getAmountElterngeldRow(state.stepRechner.ET1.elterngeldResult),
  );
  const amountElterngeldRowsET2 = useAppSelector((state) =>
    getAmountElterngeldRow(state.stepRechner.ET2.elterngeldResult),
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

  const [lebensmonateVisibleLength, setLebensmonateVisibleLength] = useState(
    initialLebensmonateVisibleLength,
  );

  const lastToggledElterngeldTypeRef = useRef<LastToggledElterngeldType>();

  const {
    basiselterngeld: BEGRemainingMonth,
    elterngeldplus: EGPlusRemainingMonth,
  } = elternteile.remainingMonths;

  const handleNextPage = () => {
    const validation = validateElternteile(elternteile);
    const validationMaxBEGFailed = checkMaxBEG(elternteile, antragstellende);

    if (validationMaxBEGFailed) {
      setNotificationMessages([<NotificationBEGMax />]);
    } else if (!validation.isValid) {
      setNotificationMessages([
        <NotificationValidationMonatsplaner
          errorCodes={validation.errorCodes}
        />,
      ]);
    } else {
      navigate(formSteps.zusammenfassungUndDaten.route);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const onUnMountToast = () => setNotificationMessages(null);

  useEffect(() => {
    const validation = validateElternteile(elternteile);
    const doesNotHaveContinuousEGAfterBEGAnspruch =
      validation &&
      !validation.isValid &&
      validation.errorCodes.includes("DoesNotHaveContinuousEGAfterBEGAnspruch");
    const doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll =
      validation &&
      !validation.isValid &&
      validation.errorCodes.includes(
        "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll",
      );
    const showNotificationBEGHintMinMax = checkForNotificationBEGHintMinMax(
      elternteile,
      antragstellende,
    );
    const validationMaxBEGFailed = checkMaxBEG(elternteile, antragstellende);

    const begAndEgPlusEmpty =
      BEGRemainingMonth === 0 && EGPlusRemainingMonth === 0;

    const begEmptyOnly = BEGRemainingMonth === 0 && EGPlusRemainingMonth !== 0;

    if (validationMaxBEGFailed) {
      setNotificationMessages([<NotificationBEGMax />]);
    } else if (
      doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll &&
      alleinerziehend
    ) {
      setNotificationMessages([<NotificationBEGHintMin />]);
    } else if (
      (doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll && !alleinerziehend) ||
      showNotificationBEGHintMinMax
    ) {
      setNotificationMessages([<NotificationBEGHintMinMax />]);
    } else if (doesNotHaveContinuousEGAfterBEGAnspruch) {
      setNotificationMessages([
        <NotificationValidationMonatsplaner
          errorCodes={["DoesNotHaveContinuousEGAfterBEGAnspruch"]}
        />,
      ]);
    } else if (begAndEgPlusEmpty) {
      setNotificationMessages([
        <NotificationNoFurtherMonthAvailable targetType="BEGAndEG+" />,
      ]);
    } else if (begEmptyOnly) {
      setNotificationMessages([
        <NotificationNoFurtherMonthAvailable targetType="BEG" />,
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

  useEffect(() => {
    // TODO
  }, []);

  const {
    highestAllowedDeselectablePSBIndex,
    lowestAllowedDeselectablePSBIndex,
  } = {
    highestAllowedDeselectablePSBIndex: Math.max(
      ...selectablePSBMonths.deselectableIndices,
    ),
    lowestAllowedDeselectablePSBIndex: Math.min(
      ...selectablePSBMonths.deselectableIndices,
    ),
  };

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

    if (
      monthIndex > lowestAllowedDeselectablePSBIndex &&
      monthIndex < highestAllowedDeselectablePSBIndex
    ) {
      setNotificationMessages([<NotificationPSBNotDeselectable />]);
      return;
    }

    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex,
      }),
    );

    if (columnType === "PSB") {
      const automaticallySelectedIndex = getAutomaticallySelectedPSBMonthIndex(
        elternteile.ET1.months,
        monthIndex,
      );

      setNotificationMessages([
        ...(antragstellende === "FuerBeide"
          ? [<NotificationPSBChangeOtherElternteil />]
          : []),
        ...(automaticallySelectedIndex
          ? [
              <NotificationPSBAutomaticallySelection
                label={lebensmonate[automaticallySelectedIndex].labelLong}
              />,
            ]
          : []),
      ]);
    }

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

    if (
      monthIndex > lowestAllowedDeselectablePSBIndex &&
      monthIndex < highestAllowedDeselectablePSBIndex
    ) {
      setNotificationMessages([<NotificationPSBNotDeselectable />]);
      return;
    }

    dispatch(
      monatsplanerActions.changeMonth({
        elternteil,
        targetType,
        partnerMonate,
        monthIndex,
      }),
    );
  };

  const handlePageBack = () => navigate(formSteps.elterngeldvarianten.route);

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

  const [
    showedNotificationForMaxSimultaneousBEGMonths,
    setShowedNotificationForMaxSimultaneousBEGMonths,
  ] = useState(false);

  function possiblyShowNotificationForMaxSimultaneousBEGMonths() {
    const reachedLimit = reachedLimitOfSimultaneousBEGMonths(elternteile);
    const isException =
      isExceptionToSimulatenousMonthRestrictions(elternteileSettings);

    if (reachedLimit && !isException) {
      if (!showedNotificationForMaxSimultaneousBEGMonths) {
        setShowedNotificationForMaxSimultaneousBEGMonths(true);
        setNotificationMessages([<NotificationMaxSimultaneousBEGMonths />]);
      }
    } else {
      setShowedNotificationForMaxSimultaneousBEGMonths(false);
    }
  }

  useEffect(possiblyShowNotificationForMaxSimultaneousBEGMonths, [
    elternteile,
    elternteileSettings,
    showedNotificationForMaxSimultaneousBEGMonths,
  ]);

  const summationData = useSummarizeData();
  const planningContingentMonths = usePlanningContingentMonths();

  const elementToViewOnRepeatPlanning = useRef<HTMLDivElement>(null);

  function repeatPlanning(): void {
    dispatch(monatsplanerActions.resetMonths());
    elementToViewOnRepeatPlanning.current?.scrollIntoView({
      behavior: "smooth",
    });
    elementToViewOnRepeatPlanning.current?.focus({ preventScroll: true });
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
          <h2 ref={elementToViewOnRepeatPlanning} tabIndex={-1}>
            Monatsplaner
          </h2>
          <P>
            Im Monatsplaner können Sie Ihre individuelle Kombination von
            Elterngeld für jeden Lebensmonat Ihres Kindes planen. In der Tabelle
            unten können Sie durch anklicken des jeweiligen Monats wählen, wann
            Sie welches Elterngeld bekommen möchten. Darüber sehen Sie jeweils
            wie viele Monate Sie noch zur Verfügung haben.
          </P>
        </div>

        {!!isMonatsplanerOverlayVisible && <AccessControl />}
        <div
          className={classNames(
            isMonatsplanerOverlayVisible && nsp("monatsplaner__blur"),
          )}
          aria-hidden={isMonatsplanerOverlayVisible}
        >
          <PlanningContingent
            className="print:hidden"
            months={planningContingentMonths}
          />

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
              lebensmonate={lebensmonate.slice(0, lebensmonateVisibleLength)}
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
                lebensmonate={lebensmonate.slice(0, lebensmonateVisibleLength)}
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
            {lebensmonateVisibleLength === initialLebensmonateVisibleLength && (
              <Button
                buttonStyle="secondary"
                label="Alle Monate anzeigen"
                iconBefore={<AddIcon />}
                onClick={() =>
                  setLebensmonateVisibleLength(lebensmonate.length)
                }
              />
            )}

            <SummationFooter
              className="w-full bg-white p-16"
              data={summationData}
            />

            <P bold={false}>
              Dieses Ergebnis ist nicht rechtsverbindlich. Erst nach der Geburt
              Ihres Kindes kann Ihre zuständige Elterngeldstelle eine konkrete
              und rechtsverbindliche Berechnung Ihres Anspruchs vornehmen.
            </P>
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

      <div className="my-40 flex flex-wrap gap-32 print:hidden">
        <Button
          buttonStyle="link"
          label="Planung wiederholen"
          iconBefore={<RestartAltIcon />}
          onClick={repeatPlanning}
        />

        <Button
          buttonStyle="link"
          label="Download der Planung"
          iconBefore={<SaveAltIcon />}
          onClick={handlePrint}
        />
      </div>

      <section className={nsp("monatsplaner__button-group")}>
        <Button
          onClick={handlePageBack}
          label="Zurück"
          buttonStyle="secondary"
        />
        <Button onClick={handleNextPage} label="Zur Übersicht" />
      </section>
    </>
  );
}
