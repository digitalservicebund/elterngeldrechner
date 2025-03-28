import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter } from "./tracking-geplante-monate-des-partners-der-mutter";
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
  pushTrackingEvent,
  resetTrackingPlanung,
  trackEase,
  trackObstacle,
  trackPartnerschaftlicheVerteilung,
  trackPlannedMonths,
  trackPlannedMonthsWithIncome,
} from "@/application/user-tracking";
import { setTrackingVariable } from "@/application/user-tracking/core";
import { MAX_EINKOMMEN } from "@/elterngeldrechner/model/egr-berechnung-param-id";
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

  const { plan: initialPlan, navigateWithPlanState } = useNavigateWithPlan();
  const initialPlanerInformation = useRef(
    initialPlan !== undefined
      ? { plan: initialPlan }
      : { ausgangslage: composeAusgangslageFuerPlaner(store.getState()) },
  );
  const [plan, setPlan] = useState(() => initialPlan);
  const berechneElterngeldbezuege = useBerechneElterngeldbezuege();
  const [istPlanGueltig, setIstPlanGueltig] = useState(true);
  const hasPlan = plan !== undefined;

  const { isFeebackSubmitted, submitFeedback } = useUserFeedback();
  const [hasChanges, setHasChanges] = useState(!!initialPlan);
  const rememberSubmit = useRef(false);

  const [trackingConsent, setTrackingConsent] = useState(false);

  const [isErklaerungOpen, setIsErklaerungOpen] = useState(false);

  function showErklaerung(): void {
    setIsErklaerungOpen(true);
    pushTrackingEvent("Erklärungen-im-Planer-wurden-geöffnet");
  }

  function hideErklaerung(): void {
    setIsErklaerungOpen(false);
    window.scrollTo(0, 0);
    pushTrackingEvent("Erklärungen-im-Planer-wurden-geschlossen");
  }

  useEffect(() => {
    void (async () => {
      setTrackingConsent(await isTrackingAllowedByUser());
    })();
  }, []);

  function updateStateForChangedPlan(
    plan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    setHasChanges(true);
    setPlan(plan);
    setIstPlanGueltig(istPlanGueltig);
  }

  function trackMetricsForChangedPlan(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    if (istPlanGueltig) {
      trackPartnerschaftlicheVerteilungForPlan(nextPlan);
    }

    trackPlannedMonthsWithIncome(nextPlan);
    trackPlannedMonths(nextPlan);
    evaluateAndTrackAnzahlGeplanterMonateDesPartnersDerMutter(nextPlan);
  }

  function handlePlanChanges(
    nextPlan: PlanMitBeliebigenElternteilen,
    istPlanGueltig: boolean,
  ): void {
    updateStateForChangedPlan(nextPlan, istPlanGueltig);
    trackMetricsForChangedPlan(nextPlan, istPlanGueltig);
  }

  function trackEineOptionWurdeGewaehlt(): void {
    pushTrackingEvent("Option-wurde-im-Planer-gewaehlt");
  }

  function trackMetricsForResetPlan(): void {
    resetTrackingPlanung();
    pushTrackingEvent("Plan-wurde-zurückgesetzt");
    setTrackingVariable(
      "Identifier-des-ausgewaehlten-Beispiels-im-Planer",
      null,
    );
  }

  function trackOpeningOfLebensmonat(): void {
    pushTrackingEvent("Lebensmonat-wurde-im-Planer-geöffnet");
  }

  function trackEinBeispielWurdeAusgewaehlt(beispiel: {
    identifier: string;
  }): void {
    setTrackingVariable(
      "Identifier-des-ausgewaehlten-Beispiels-im-Planer",
      beispiel.identifier,
    );

    pushTrackingEvent("Beispiel-wurde-im-Planer-ausgewählt");
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

  const showFeedbackForm = hasChanges && !isFeebackSubmitted && trackingConsent;

  useEffect(resetTrackingPlanung, []);

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
                onWaehleOption: trackEineOptionWurdeGewaehlt,
                onSetzePlanZurueck: trackMetricsForResetPlan,
                onOpenLebensmonat: trackOpeningOfLebensmonat,
                onOpenErklaerung: showErklaerung,
                onWaehleBeispielAus: trackEinBeispielWurdeAusgewaehlt,
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
                label="Zurück"
                buttonStyle="secondary"
                onClick={navigateToEinkommenPage}
              />

              <Button
                label="Zur Zusammenfassung"
                disabled={!istPlanGueltig}
                onClick={navigateToZusammenfassungUndDatenPage}
              />
            </div>

            <p className="mb-40 max-w-[70ch] text-16">
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
