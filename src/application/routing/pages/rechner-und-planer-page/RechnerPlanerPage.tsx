import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter } from "./tracking-geplante-monate-des-partners-der-mutter";
import { useBerechneElterngeldbezuege } from "./useBerechneElterngeldbezuege";
import { Button } from "@/application/components";
import {
  YesNo,
  composeAusgangslageFuerPlaner,
  stepAllgemeineAngabenSelectors,
} from "@/application/features/abfrageteil/state";
import { Planer } from "@/application/features/planer";
import {
  UserFeedbackForm,
  useUserFeedback,
} from "@/application/features/user-feedback";
import { useAppSelector, useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { Page } from "@/application/routing/pages/page";
import { useNavigateWithPlan } from "@/application/routing/pages/useNavigateWithPlan";
import {
  countUpAnzahlGeoeffneterLebensmonateImPlaner,
  isTrackingAllowedByUser,
  trackPartnerschaftlicheVerteilung,
} from "@/application/user-tracking";
import {
  getTrackedEase,
  getTrackedObstacle,
  trackEase,
  trackObstacle,
} from "@/application/user-tracking/feedback";
import {
  resetTrackingPlanung,
  trackChanges,
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
} from "@/application/user-tracking/planung";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/elterngeldrechner/model/egr-berechnung-param-id";
import type { PlanMitBeliebigenElternteilen } from "@/monatsplaner";
import { Variante, listeElternteileFuerAusgangslageAuf } from "@/monatsplaner";

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

  const { isFeebackSubmitted, submitFeedback } = useUserFeedback();
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

  const navigateToElterngeldvariantenPage = () => {
    if (rememberSubmit.current) submitFeedback();
    navigate(formSteps.elterngeldvarianten.route);
  };

  function navigateToZusammenfassungUndDatenPage(): void {
    if (istPlanGueltig) {
      if (rememberSubmit.current) submitFeedback();

      navigateWithPlanState(
        formSteps.zusammenfassungUndDaten.route,
        plan.current,
      );
    }
  }

  const showFeedbackForm = hasChanges && !isFeebackSubmitted && trackingConsent;

  useEffect(resetTrackingPlanung, []);

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <div ref={mainElement} className="flex flex-col gap-56" tabIndex={-1}>
        <Planer
          initialInformation={initialPlanerInformation.current}
          berechneElterngeldbezuege={berechneElterngeldbezuege}
          callbacks={{
            onChange: setPlan,
            onWaehleOption: trackChanges,
            onSetzePlanZurueck: resetTrackingPlanung,
            onOpenLebensmonat: countUpAnzahlGeoeffneterLebensmonateImPlaner,
          }}
        />

        {!!showFeedbackForm && (
          <UserFeedbackForm
            ease={getTrackedEase()}
            obstacle={getTrackedObstacle()}
            onChangeEase={trackEase}
            onChangeObstacle={trackObstacle}
            onSubmit={() => (rememberSubmit.current = true)}
          />
        )}

        <div className="flex justify-between">
          <Button
            label="Zurück"
            buttonStyle="secondary"
            onClick={navigateToElterngeldvariantenPage}
          />

          <Button
            label="Zur Zusammenfassung"
            disabled={!istPlanGueltig}
            onClick={navigateToZusammenfassungUndDatenPage}
          />
        </div>
      </div>

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
