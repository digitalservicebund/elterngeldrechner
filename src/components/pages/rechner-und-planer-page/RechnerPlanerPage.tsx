import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter } from "./tracking-geplante-monate-des-partners-der-mutter";
import { useBerechneElterngeldbezuege } from "./useBerechneElterngeldbezuege";
import { Button } from "@/components/atoms";
import { ButtonGroup } from "@/components/molecules";
import { FeedbackForm, Page } from "@/components/organisms";
import { formSteps } from "@/components/pages/formSteps";
import { useNavigateWithPlan } from "@/components/pages/useNavigateWithPlan";
import type { PlanMitBeliebigenElternteilen } from "@/features/planer/domain";
import {
  Variante,
  listeElternteileFuerAusgangslageAuf,
} from "@/features/planer/domain";
import { Planer } from "@/features/planer/user-interface";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";
import { composeAusgangslageFuerPlaner } from "@/redux/composeAusgangslageFuerPlaner";
import { feedbackActions, feedbackSelectors } from "@/redux/feedbackSlice";
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { YesNo } from "@/redux/yes-no";
import {
  isTrackingAllowedByUser,
  trackPartnerschaftlicheVerteilung,
} from "@/user-tracking";
import {
  getTrackedEase,
  getTrackedObstacle,
  trackEase,
  trackObstacle,
} from "@/user-tracking/feedback";
import {
  resetTrackingPlanung,
  trackChanges,
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
} from "@/user-tracking/planung";

export function RechnerPlanerPage() {
  const store = useAppStore();
  const mainElement = useRef<HTMLDivElement>(null);
  const dialogElement = useRef<HTMLDialogElement>(null);

  function openDialogWhenEinkommenLimitUebeschritten() {
    const isEinkommenLimitUeberschritten =
      store.getState().stepEinkommen.limitEinkommenUeberschritten === YesNo.YES;

    if (isEinkommenLimitUeberschritten) dialogElement.current?.showModal();
  }

  function closeDialog() {
    dialogElement.current?.close();
    mainElement.current?.focus();
  }

  useEffect(openDialogWhenEinkommenLimitUebeschritten, [store]);

  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend,
  );
  const amountLimitEinkommen =
    alleinerziehend === YesNo.YES ? MAX_EINKOMMEN_ALLEIN : MAX_EINKOMMEN_BEIDE;

  const { plan: initialPlan, navigateWithPlanState } = useNavigateWithPlan();
  const initialPlanerInformation = useRef(
    initialPlan !== undefined
      ? { plan: initialPlan }
      : { ausgangslage: composeAusgangslageFuerPlaner(store.getState()) },
  );
  const plan = useRef(initialPlan);
  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();
  const [istPlanGueltig, setIstPlanGueltig] = useState(true);

  const dispatch = useAppDispatch();
  const submitted = useAppSelector(feedbackSelectors.selectSubmitted);
  const [hasChanges, setHasChanges] = useState(!!initialPlan);
  const rememberSubmit = useRef(false);

  const [trackingConsent, setTrackingConsent] = useState(false);

  useEffect(() => {
    void (async () => {
      setTrackingConsent(await isTrackingAllowedByUser());
    })();
  }, []);

  function setPlan(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    setHasChanges(true);

    plan.current = nextPlan;

    setIstPlanGueltig(istPlanGueltig);

    if (istPlanGueltig) {
      trackPartnerschaftlicheVerteilungForPlan(nextPlan);
    }

    trackPlannedMonthsWithIncome(nextPlan);
    trackPlannedMonths(nextPlan);
    evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(nextPlan);
  }

  const navigate = useNavigate();

  const navigateToPreviousStep = () => {
    if (rememberSubmit.current) {
      dispatch(feedbackActions.submit());
    }

    navigate(formSteps.elterngeldvarianten.route);
  };

  function navigateToUebersicht(): void {
    if (istPlanGueltig) {
      if (rememberSubmit.current) {
        dispatch(feedbackActions.submit());
      }

      navigateWithPlanState(
        formSteps.zusammenfassungUndDaten.route,
        plan.current,
      );
    }
  }

  const showFeedbackForm = hasChanges && !submitted && trackingConsent;

  useEffect(resetTrackingPlanung, []);

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <div
        ref={mainElement}
        className="flex flex-wrap justify-between gap-y-80"
        tabIndex={-1}
      >
        <Planer
          className="basis-full"
          initialInformation={initialPlanerInformation.current}
          berechneElterngeldbezuege={berechneElterngeldbezuege}
          onPlanChanged={setPlan}
          onOptionSelected={trackChanges}
          onPlanResetted={resetTrackingPlanung}
        />

        {!!showFeedbackForm && (
          <FeedbackForm
            className="basis-full"
            ease={getTrackedEase()}
            obstacle={getTrackedObstacle()}
            onChangeEase={trackEase}
            onChangeObstacle={trackObstacle}
            onSubmit={() => (rememberSubmit.current = true)}
          />
        )}
      </div>

      <ButtonGroup onClickBackButton={navigateToPreviousStep}>
        <Button
          label="Zur Zusammenfassung"
          onClick={navigateToUebersicht}
          disabled={!istPlanGueltig}
        />
      </ButtonGroup>

      <dialog
        ref={dialogElement}
        className="flex-col items-center gap-10 bg-primary-light open:flex"
      >
        <p>
          Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld
          bekommen. Falls noch nicht feststeht, ob Sie die Grenze von{" "}
          {amountLimitEinkommen.toLocaleString()} Euro überschreiten, können Sie
          trotzdem einen Antrag stellen.
        </p>

        <Button label="Dialog schließen" onClick={closeDialog} />
      </dialog>
    </Page>
  );
}

function trackPartnerschaftlicheVerteilungForPlan(
  plan: PlanMitBeliebigenElternteilen,
): void {
  const elternteile = listeElternteileFuerAusgangslageAuf(plan.ausgangslage);

  const auswahlProMonatProElternteil = elternteile.map((elternteil) =>
    Object.values(plan.lebensmonate)
      .map((lebensmonat) => lebensmonat[elternteil])
      .map((monat) => monat.gewaehlteOption)
      .map((option) => {
        switch (option) {
          case Variante.Basis:
            return "Basis";
          case Variante.Plus:
            return "Plus";
          case Variante.Bonus:
            return "Bonus";
          default:
            return null;
        }
      }),
  );

  trackPartnerschaftlicheVerteilung(auswahlProMonatProElternteil);
}
