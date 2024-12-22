import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBerechneElterngeldbezuege } from "./useBerechneElterngeldbezuege";
import { formSteps } from "@/components/pages/formSteps";
import { Button } from "@/components/atoms";
import { useAppDispatch, useAppSelector, useAppStore } from "@/redux/hooks";
import { Page } from "@/components/organisms/page";
import ModalPopup from "@/components/organisms/modal-popup/ModalPopup";
import { YesNo } from "@/globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";
import type { PlanMitBeliebigenElternteilen } from "@/features/planer/domain";
import { Planer } from "@/features/planer/user-interface";
import { useNavigateWithPlan } from "@/hooks/useNavigateWithPlan";
import { composeAusgangslageFuerPlaner } from "@/redux/composeAusgangslageFuerPlaner";
import {
  isTrackingAllowedByUser,
  trackPartnerschaftlicheVerteilung,
} from "@/user-tracking";
import {
  trackChanges,
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
  resetTrackingPlanung,
} from "@/user-tracking/planung";
import {
  getTrackedEase,
  getTrackedObstacle,
  trackEase,
  trackObstacle,
} from "@/user-tracking/feedback";
import { FeedbackForm } from "@/components/organisms/feedback-form";
import { feedbackActions, feedbackSelectors } from "@/redux/feedbackSlice";
import {
  listeElternteileFuerAusgangslageAuf,
  Variante,
} from "@/features/planer/domain";

export function RechnerPlanerPage() {
  const isLimitEinkommenUeberschritten = useAppSelector((state) =>
    state.stepEinkommen.limitEinkommenUeberschritten === YesNo.YES
      ? true
      : null,
  );
  const [showModalPopup, setShowModalPopup] = useState<boolean | null>(
    isLimitEinkommenUeberschritten,
  );
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend,
  );
  const amountLimitEinkommen =
    alleinerziehend === YesNo.YES ? MAX_EINKOMMEN_ALLEIN : MAX_EINKOMMEN_BEIDE;

  const store = useAppStore();
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
      <div className="flex flex-wrap justify-between gap-y-80">
        <Planer
          className="basis-full"
          initialInformation={initialPlanerInformation.current}
          berechneElterngeldbezuege={berechneElterngeldbezuege}
          onPlanChanged={setPlan}
          onOptionSelected={trackChanges}
          onPlanResetted={resetTrackingPlanung}
        >
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
        </Planer>

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />

        <Button
          label="Zur Übersicht"
          onClick={navigateToUebersicht}
          disabled={!istPlanGueltig}
        />
      </div>

      {!!showModalPopup && (
        <ModalPopup
          text={`Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Falls noch nicht feststeht, ob Sie die Grenze von ${amountLimitEinkommen.toLocaleString()} Euro überschreiten, können Sie trotzdem einen Antrag stellen.`}
          onClick={() => setShowModalPopup(false)}
          buttonLabel="Dialog schließen"
        />
      )}
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
