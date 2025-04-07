import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  trackMetricsForDerPlanHatSichGeaendert,
  trackMetricsForEinBeispielWurdeAusgewaehlt,
  trackMetricsForEineOptionWurdeGewaehlt,
  trackMetricsForErklaerungenWurdenGeoeffnet,
  trackMetricsForErklaerungenWurdenGeschlossen,
  trackMetricsForLebensmonatWurdeGeoeffnet,
  trackMetricsForPlanWurdeZurueckgesetzt,
  trackMetricsForPlanerWurdeGeoeffnet,
} from "./tracking";
import { useBerechneElterngeldbezuege } from "./useBerechneElterngeldbezuege";
import { Button } from "@/application/components";
import {
  YesNo,
  composeAusgangslageFuerPlaner,
} from "@/application/features/abfrageteil/state";
import {
  Erklaerung,
  Planer,
  Zusammenfassung,
} from "@/application/features/planer";
import {
  UserFeedbackForm,
  useUserFeedback,
} from "@/application/features/user-feedback";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { Page } from "@/application/routing/pages/Page";
import { useNavigateWithPlan } from "@/application/routing/pages/useNavigateWithPlan";
import {
  getTrackedEase,
  getTrackedObstacle,
  isTrackingAllowedByUser,
  trackEase,
  trackObstacle,
} from "@/application/user-tracking";
import { MAX_EINKOMMEN } from "@/elterngeldrechner";
import { type PlanMitBeliebigenElternteilen } from "@/monatsplaner";

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

  const { plan: initialPlan, navigateWithPlanState } = useNavigateWithPlan();
  const initialPlanerInformation = useRef(
    initialPlan !== undefined
      ? { plan: initialPlan }
      : { ausgangslage: composeAusgangslageFuerPlaner(store.getState()) },
  );
  const [plan, setPlan] = useState(() => initialPlan);
  const [istPlanGueltig, setIstPlanGueltig] = useState(true);
  const [hasChanges, setHasChanges] = useState(!!initialPlan);
  const hasPlan = plan !== undefined;
  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  function updateStateForChangedPlan(
    plan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    setHasChanges(true);
    setPlan(plan);
    setIstPlanGueltig(istPlanGueltig);
  }

  const [trackingConsent, setTrackingConsent] = useState(false);
  const { isFeebackSubmitted, submitFeedback } = useUserFeedback();
  const rememberSubmit = useRef(false);
  const showFeedbackForm = hasChanges && !isFeebackSubmitted && trackingConsent;

  useEffect(() => {
    void (async () => {
      setTrackingConsent(await isTrackingAllowedByUser());
    })();
  }, []);

  const [isErklaerungOpen, setIsErklaerungOpen] = useState(false);

  function showErklaerung(): void {
    setIsErklaerungOpen(true);
    trackMetricsForErklaerungenWurdenGeoeffnet();
  }

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
    trackMetricsForErklaerungenWurdenGeschlossen();
  }

  function handlePlanChanges(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    updateStateForChangedPlan(nextPlan, istPlanGueltig);
    trackMetricsForDerPlanHatSichGeaendert(nextPlan, istPlanGueltig);
  }

  const navigate = useNavigate();

  const navigateToEinkommenPage = () => {
    if (rememberSubmit.current) submitFeedback();
    navigate(formSteps.einkommen.route);
  };

  function navigateToZusammenfassungUndDatenPage(): void {
    if (istPlanGueltig) {
      if (rememberSubmit.current) submitFeedback();

      navigateWithPlanState(formSteps.zusammenfassungUndDaten.route, plan);
    }
  }

  useEffect(trackMetricsForPlanerWurdeGeoeffnet, []);

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      {!!hasPlan && (
        <Zusammenfassung plan={plan} className="hidden print:block" />
      )}

      <div className="print:hidden">
        {isErklaerungOpen ? (
          <Erklaerung onClose={hideErklaerung} />
        ) : (
          <div ref={mainElement} className="flex flex-col gap-56" tabIndex={-1}>
            <Planer
              initialInformation={initialPlanerInformation.current}
              berechneElterngeldbezuege={berechneElterngeldbezuege}
              callbacks={{
                onChange: handlePlanChanges,
                onWaehleOption: trackMetricsForEineOptionWurdeGewaehlt,
                onSetzePlanZurueck: trackMetricsForPlanWurdeZurueckgesetzt,
                onOpenLebensmonat: trackMetricsForLebensmonatWurdeGeoeffnet,
                onOpenErklaerung: showErklaerung,
                onWaehleBeispielAus: trackMetricsForEinBeispielWurdeAusgewaehlt,
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

            <div className="flex gap-16">
              <Button
                type="button"
                buttonStyle="secondary"
                onClick={navigateToEinkommenPage}
              >
                Zurück
              </Button>

              <Button
                type="button"
                disabled={!istPlanGueltig}
                onClick={navigateToZusammenfassungUndDatenPage}
              >
                Zur Zusammenfassung
              </Button>
            </div>

            <p className="mb-40 max-w-[70ch]">
              Hinweis: Mutterschaftsleistungen werden nicht in der Summe
              berücksichtigt.
              <br />
              Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass
              etwas abgezogen wird. Auf das angezeigte Einkommen müssen noch
              Steuern entrichtet werden.
            </p>
          </div>
        )}
      </div>

      <dialog
        ref={dialogElement}
        className="flex-col items-center gap-10 bg-primary-light open:flex"
      >
        <p>
          Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld
          bekommen. Falls noch nicht feststeht, ob Sie die Grenze von{" "}
          {MAX_EINKOMMEN.toLocaleString()} Euro überschreiten, können Sie
          trotzdem einen Antrag stellen.
        </p>

        <Button type="button" onClick={closeDialog}>
          Dialog schließen
        </Button>
      </dialog>
    </Page>
  );
}
