import { ReactNode, useEffect, useRef, useState, VFC } from "react";
import {
  ElterngeldType,
  ElternteilType,
  Month,
  validateElternteile,
} from "@egr/monatsplaner-app";
import {
  getAutomaticallySelectedPSBMonthIndex,
  monatsplanerActions,
  monatsplanerSelectors,
} from "../../../redux/monatsplanerSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import { stepNachwuchsSelectors } from "../../../redux/stepNachwuchsSlice";
import {
  ElterngeldRowsResult,
  stepRechnerSelectors,
} from "../../../redux/stepRechnerSlice";
import {
  Button,
  Icon,
  NotificationNoFurtherMonthAvailable,
  NotificationPSBAutomaticallySelection,
  NotificationPSBChangeOtherElternteil,
  NotificationPSBNotDeselectable,
  NotificationValidationMonatsplaner,
  P,
  Toast,
} from "../../atoms";
import {
  AccessControl,
  AmountElterngeldRow,
  Elternteil,
  RemainingMonths,
} from "../../molecules";
import nsp from "../../../globals/js/namespace";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import { formSteps } from "../../../utils/formSteps";
import { EgrConst } from "../../../globals/js/egr-configuration";
import { resetStoreAction } from "../../../redux/resetStoreAction";
import { YesNo } from "../../../globals/js/calculations/model";
import { NotificationBEGHintMinMax } from "../../atoms/notification";

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

export const Monatsplaner: VFC<Props> = ({ mutterSchutzMonate }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  const begCountOf = (months: readonly Month[]) =>
    months.filter((month) => month.type === "BEG").length;

  const handleNextPage = () => {
    const validation = validateElternteile(elternteile);

    if (!validation.isValid) {
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
    const begEt1 = begCountOf(elternteile.ET1.months);
    const begEt2 = begCountOf(elternteile.ET2.months);

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

    const beg11plus1 =
      antragstellende === "FuerBeide" &&
      ((begEt1 === 12 && begEt2 === 0) ||
        (begEt1 === 11 && begEt2 === 1) ||
        (begEt2 === 12 && begEt1 === 0) ||
        (begEt2 === 11 && begEt1 === 1));

    const begAndEgPlusEmpty =
      BEGRemainingMonth === 0 && EGPlusRemainingMonth === 0;

    const begEmptyOnly = BEGRemainingMonth === 0 && EGPlusRemainingMonth !== 0;

    if (beg11plus1 || doesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll) {
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
  ]);

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
        monthIndex,
      }),
    );
  };

  const handlePageBack = () => navigate("/einkommen");

  const handleRestartForm = () => {
    navigate("/");
    dispatch(resetStoreAction());
  };

  return (
    <>
      <div
        className={classNames(
          nsp("monatsplaner"),
          alleinerziehend === YesNo.YES && nsp("monatsplaner--alleinerziehend"),
        )}
      >
        <div className={nsp("monatsplaner__header")}>
          <h2>Monatsplaner</h2>
          <P>
            Im Monatsplaner können Sie Ihre individuelle Kombination von
            Elterngeld für jeden Lebensmonat Ihres Kindes planen. In der Tabelle
            unten können Sie durch anklicken des jeweiligen Monats wählen, wann
            Sie welches Elterngeld bekommen möchten. Darüber sehen Sie jeweils
            wie viele Monate Sie noch zur Verfügung haben. Hinweis für
            Alleinerziehende: Die Ihnen zustehenden Partnermonate und
            Partnerschaftsbonusmonate werden hier nicht angezeigt.
          </P>
        </div>

        {isMonatsplanerOverlayVisible && <AccessControl />}
        <div
          className={classNames(
            isMonatsplanerOverlayVisible && nsp("monatsplaner__blur"),
          )}
          aria-hidden={isMonatsplanerOverlayVisible}
        >
          <RemainingMonths
            remainingMonthByType={elternteile.remainingMonths}
            alleinerziehend={alleinerziehend}
          />
          <div className={nsp("monatsplaner__tables")}>
            <Elternteil
              className={nsp("monatsplaner__sticky-elternteil")}
              elternteil={elternteile.ET1}
              selectablePSBMonths={selectablePSBMonths}
              elternteilName={elternteilNames.ET1}
              onToggleMonth={(columnType, monthIndex) =>
                handleToggleMonth("ET1", columnType, monthIndex)
              }
              onDragOverMonth={(columnType, monthIndex) =>
                handleDragOver("ET1", columnType, monthIndex)
              }
              lebensmonate={lebensmonate.slice(0, lebensmonateVisibleLength)}
              amounts={amountElterngeldRowsET1}
              hasMutterschutz={mutterschutzElternteil === "ET1"}
              mutterSchutzMonate={mutterSchutzMonate}
              remainingMonths={elternteile.remainingMonths}
              isElternteilOne={true}
              alleinerziehend={alleinerziehend}
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
                lebensmonate={lebensmonate.slice(0, lebensmonateVisibleLength)}
                amounts={amountElterngeldRowsET2}
                hasMutterschutz={mutterschutzElternteil === "ET2"}
                mutterSchutzMonate={mutterSchutzMonate}
                remainingMonths={elternteile.remainingMonths}
                hideLebensmonateOnDesktop={true}
              />
            )}
          </div>
          <div className={nsp("monatsplaner__footer")}>
            {lebensmonateVisibleLength === initialLebensmonateVisibleLength && (
              <Button
                buttonStyle="secondary"
                label="Alle Monate anzeigen"
                iconBefore={<Icon name="plus" />}
                onClick={() =>
                  setLebensmonateVisibleLength(lebensmonate.length)
                }
              />
            )}
            <Toast
              messages={notificationMessages}
              active={
                notificationMessages !== null && notificationMessages.length > 0
              }
              onUnMount={onUnMountToast}
              timeout={6000}
            />
            <div className={nsp("monatsplaner__footer-buttons")}>
              <Button
                buttonStyle="link"
                label="Ergebnis drucken"
                iconBefore={<Icon name="arrow" />}
                onClick={handlePrint}
              />
            </div>
          </div>
        </div>
      </div>

      <section className={nsp("monatsplaner__button-group")}>
        <div className={nsp("monatsplaner__button-group-backwards")}>
          <Button
            onClick={handlePageBack}
            label="Zurück"
            buttonStyle="secondary"
          />
          <Button
            onClick={handleRestartForm}
            label="Neu starten"
            buttonStyle="secondary"
          />
        </div>
        <Button
          onClick={handleNextPage}
          label="Elterngeld beantragen und Daten übermitteln"
        />
      </section>
    </>
  );
};
