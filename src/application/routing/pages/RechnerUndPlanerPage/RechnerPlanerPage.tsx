import { ChevronLeft } from "@digitalservicebund/icons/index";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  trackMetricsForDerPlanHatSichGeaendert,
  trackMetricsForEineOptionWurdeGewaehlt,
  trackMetricsForErklaerungenWurdenGeoeffnet,
  trackMetricsForErklaerungenWurdenGeschlossen,
  trackMetricsForLebensmonatWurdeGeoeffnet,
  trackMetricsForPlanWurdeZurueckgesetzt,
  trackMetricsForPlanerWurdeGeoeffnet,
  trackMetricsForPlanungDrucken,
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
  const [hasChanges, setHasChanges] = useState(!!initialPlan);
  const hasPlan = plan !== undefined;
  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();

  function updateStateForChangedPlan(
    plan: PlanMitBeliebigenElternteilen,
  ): void {
    setHasChanges(true);
    setPlan(plan);
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
    updateStateForChangedPlan(nextPlan);
    trackMetricsForDerPlanHatSichGeaendert(nextPlan, istPlanGueltig);
  }

  const navigate = useNavigate();

  const navigateToBeispielePage = () => {
    if (rememberSubmit.current) submitFeedback();
    void navigate(formSteps.beispiele.route);
  };

  function navigateToDatenuebernahmeAntragPage(): void {
    if (rememberSubmit.current) submitFeedback();

    void navigateWithPlanState(formSteps.datenuebernahmeAntrag.route, plan);
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
              planInAntragUebernehmen={navigateToDatenuebernahmeAntragPage}
              callbacks={{
                onChange: handlePlanChanges,
                onWaehleOption: trackMetricsForEineOptionWurdeGewaehlt,
                onSetzePlanZurueck: trackMetricsForPlanWurdeZurueckgesetzt,
                onOpenLebensmonat: trackMetricsForLebensmonatWurdeGeoeffnet,
                onPlanungDrucken: trackMetricsForPlanungDrucken,
                onOpenErklaerung: showErklaerung,
              }}
            />

            <div className="flex gap-16">
              <Button
                type="button"
                buttonStyle="secondary"
                onClick={navigateToBeispielePage}
              >
                <ChevronLeft /> Zurück zur Auswahl
              </Button>
            </div>

            <p className="max-w-[70ch]">
              Hinweis: Mutterschaftsleistungen werden nicht in der Summe
              berücksichtigt.
              <br />
              Sie bekommen Elterngeld in der Höhe, die angegeben ist, ohne dass
              etwas abgezogen wird. Auf das angezeigte Einkommen müssen noch
              Steuern entrichtet werden.
            </p>

            {!!showFeedbackForm && (
              <UserFeedbackForm
                ease={getTrackedEase()}
                obstacle={getTrackedObstacle()}
                onChangeEase={trackEase}
                onChangeObstacle={trackObstacle}
                onSubmit={() => (rememberSubmit.current = true)}
              />
            )}
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
          {MAX_EINKOMMEN.toLocaleString("de-DE")} Euro überschreiten, können Sie
          trotzdem einen Antrag stellen.
        </p>

        <Button type="button" onClick={closeDialog}>
          Dialog schließen
        </Button>
      </dialog>
    </Page>
  );
}
