import { ReactNode, useEffect, useState, VFC } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { NotificationBEGResultWasRecalculated, P, Toast } from "../../atoms";
import { stepAllgemeineAngabenSelectors } from "../../../redux/stepAllgemeineAngabenSlice";
import {
  stepRechnerActions,
  StepRechnerState,
} from "../../../redux/stepRechnerSlice";
import { RechnerCardHeaderBEG } from "./RechnerCardHeaderBEG";
import { RechnerCardHeaderEGPlus } from "./RechnerCardHeaderEGPlus";
import nsp from "../../../globals/js/namespace";
import { FootNote, RechnerForm, RechnerResult } from "../../molecules";

export const Rechner: VFC = () => {
  const dispatch = useAppDispatch();
  const initialValues = useAppSelector((state) => state.stepRechner);

  const [notificationMessages, setNotificationMessages] = useState<
    ReactNode[] | null
  >(null);

  const hasElternteil1BEGResultChangedDueToPrevFormSteps = useAppSelector(
    (state) => state.stepRechner.ET1.hasBEGResultChangedDueToPrevFormSteps,
  );
  const hasElternteil2BEGResultChangedDueToPrevFormSteps = useAppSelector(
    (state) => state.stepRechner.ET2.hasBEGResultChangedDueToPrevFormSteps,
  );
  const elternteilNames = useAppSelector(
    stepAllgemeineAngabenSelectors.getElternteilNames,
  );
  const antragstellende = useAppSelector(
    stepAllgemeineAngabenSelectors.getAntragssteller,
  );
  const elterngeldResultStateElternteil1 = useAppSelector(
    (state) => state.stepRechner.ET1.elterngeldResult.state,
  );
  const elterngeldResultStateElternteil2 = useAppSelector(
    (state) => state.stepRechner.ET2.elterngeldResult.state,
  );

  const handleSubmitElternteil1 = ({ ET1 }: StepRechnerState) => {
    dispatch(
      stepRechnerActions.calculateBEG({
        elternteil: "ET1",
        bruttoEinkommenZeitraum: ET1.bruttoEinkommenZeitraum,
      }),
    );
  };

  const handleSubmitElternteil2 = ({ ET2 }: StepRechnerState) => {
    dispatch(
      stepRechnerActions.calculateBEG({
        elternteil: "ET2",
        bruttoEinkommenZeitraum: ET2.bruttoEinkommenZeitraum,
      }),
    );
  };

  // recalculate if hasElternteil1BEGResultChangedDueToPrevFormSteps
  // store values represented by initialValues
  useEffect(() => {
    if (hasElternteil1BEGResultChangedDueToPrevFormSteps) {
      handleSubmitElternteil1(initialValues);
    }
    if (hasElternteil2BEGResultChangedDueToPrevFormSteps) {
      handleSubmitElternteil2(initialValues);
    }
    // this effect should be executed only once after render
    // the square brakets are intentionally empty to prevent effect re-run
    // therefore the eslint rule will be disabled by the following comment

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effect to show notification for calculation change caused by previous input
  useEffect(() => {
    let name = [];
    if (hasElternteil1BEGResultChangedDueToPrevFormSteps) {
      name.push(elternteilNames.ET1);
    }
    if (hasElternteil2BEGResultChangedDueToPrevFormSteps) {
      name.push(elternteilNames.ET2);
    }

    if (name.length > 0) {
      setNotificationMessages([
        <NotificationBEGResultWasRecalculated
          elternteilName={name.join(" und ")}
        />,
      ]);
    }
  }, [
    hasElternteil1BEGResultChangedDueToPrevFormSteps,
    hasElternteil2BEGResultChangedDueToPrevFormSteps,
    elternteilNames,
  ]);

  const onUnMountToast = () => {
    setNotificationMessages(null);
  };

  return (
    <section className={nsp("rechner")}>
      <FootNote prefix="rechner">
        Elterngeld wird monatsweise gezahlt – allerdings nicht nach
        Kalendermonaten, sondern nach den Lebensmonaten Ihres Kindes. Diese
        beginnen nicht am Ersten des Kalendermonats, sondern je nach Geburtstag
        Ihres Kindes. Wenn Ihr Kind am 14. Februar geboren ist, dann ist der 1.
        Lebensmonat vom 14. Februar bis zum 13. März, der 2. Lebensmonat vom 14.
        März bis zum 13. April und so weiter.
      </FootNote>
      <p>
        Jeder Elternteil, der Elterngeld beantragt, muss für mindestens 2
        Lebensmonate eine Form von Elterngeld beantragen. Elterngeld gibt es in
        drei Varianten:
      </p>
      <section
        className={nsp("rechner-card--basiselterngeld")}
        aria-label="Basiselterngeld"
      >
        <RechnerCardHeaderBEG />
      </section>
      <section
        className={nsp("rechner-card--elterngeldplus")}
        aria-label="ElterngeldPlus und Partnerschaftsbonus"
      >
        <RechnerCardHeaderEGPlus />
      </section>
      <section className={nsp("rechner__description")}>
        <P bold={true}>
          Hier können Sie beispielhaft berechnen, wie viel Elterngeld Sie in
          welcher Phase Ihrer Elternzeit erwarten können. Bitte beachten Sie,
          dass das hier berechnete Ergebnis nur eine Orientierung für Sie sein
          kann. Das Ergebnis ist daher nicht bindend.
        </P>
        <p>Die Höhe des Elterngelds hängt von 3 Faktoren ab:</p>
        <ol>
          <li>der Höhe Ihres monatlichen Bruttoeinkommens vor der Geburt,</li>
          <li>der von Ihnen gewählten Variante des Elterngelds</li>
          <li>
            und der Höhe des monatlichen Bruttoeinkommens während des Bezugs von
            Elterngeld
          </li>
        </ol>
        <p>
          Im Folgenden können Sie unter Berücksichtigung dieser Faktoren
          berechnen und probieren, was am besten zu Ihren Vorstellungen für die
          Zeit nach der Geburt passt.
        </p>
      </section>

      <RechnerForm
        elternteilName={elternteilNames.ET1}
        elternteil="ET1"
        initialValues={initialValues}
        isResultPending={elterngeldResultStateElternteil1 === "pending"}
        onSubmit={handleSubmitElternteil1}
        previousFormStepsChanged={
          hasElternteil1BEGResultChangedDueToPrevFormSteps
        }
      />
      <RechnerResult elternteil="ET1" />
      {antragstellende === "FuerBeide" && (
        <>
          <RechnerForm
            elternteilName={elternteilNames.ET2}
            elternteil="ET2"
            initialValues={initialValues}
            isResultPending={elterngeldResultStateElternteil2 === "pending"}
            onSubmit={handleSubmitElternteil2}
            previousFormStepsChanged={
              hasElternteil2BEGResultChangedDueToPrevFormSteps
            }
          />
          <RechnerResult elternteil="ET2" />
        </>
      )}
      <Toast
        messages={notificationMessages}
        active={!!notificationMessages}
        onUnMount={onUnMountToast}
        timeout={10000}
      />
    </section>
  );
};
