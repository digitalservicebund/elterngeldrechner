import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/atoms";
import { useAppSelector, useAppStore } from "@/redux/hooks";
import { formSteps } from "@/utils/formSteps";
import { Page } from "@/components/organisms/page";
import ModalPopup from "@/components/organisms/modal-popup/ModalPopup";
import { YesNo } from "@/globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import {
  MAX_EINKOMMEN_ALLEIN,
  MAX_EINKOMMEN_BEIDE,
} from "@/globals/js/calculations/model/egr-berechnung-param-id";
import {
  Planer,
  type PlanMitBeliebigenElternteilen,
  Variante,
  type Elternteil,
} from "@/features/planer";
import { useNavigateWithPlan } from "@/hooks/useNavigateWithPlan";
import { composeAusgangslageFuerPlaner } from "@/redux/composeAusgangslageFuerPlaner";
import { useBerechneElterngeldbezuege } from "@/hooks/useBerechneElterngeldbezuege";
import { trackPartnerschaftlicheVerteilung } from "@/user-tracking";
import useDebounce from "@/hooks/useDebounce";
import { resetTrackingPlanung, trackPlanung } from "@/user-tracking/planung";
import { MatomoTrackingMetrics } from "@/features/planer/domain/plan";

export default function RechnerPlanerPage() {
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

  const debouncedTrackPlanung = useDebounce(
    (nextPlan: PlanMitBeliebigenElternteilen & MatomoTrackingMetrics) =>
      trackPlanung(nextPlan),
    1000,
  );

  function setPlan(
    nextPlan:
      | (PlanMitBeliebigenElternteilen & MatomoTrackingMetrics)
      | undefined,
  ): void {
    plan.current = nextPlan;
    const istPlanGueltig = nextPlan != undefined;
    setIstPlanGueltig(nextPlan !== undefined);

    if (istPlanGueltig) {
      trackPartnerschaftlicheVerteilungForPlan(nextPlan);

      debouncedTrackPlanung(nextPlan);
    } else {
      resetTrackingPlanung();
    }
  }

  function navigateToUebersicht(): void {
    if (istPlanGueltig) {
      navigateWithPlanState(
        formSteps.zusammenfassungUndDaten.route,
        plan.current,
      );
    }
  }

  const navigate = useNavigate();
  const navigateToPreviousStep = () =>
    navigate(formSteps.elterngeldvarianten.route);

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <Planer
          className="basis-full"
          initialInformation={initialPlanerInformation.current}
          onPlanChanged={setPlan}
          berechneElterngeldbezuege={berechneElterngeldbezuege}
        />

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
          buttonLabel="Dialog schließen"
          onClick={() => {
            setShowModalPopup(false);
          }}
        />
      )}
    </Page>
  );
}

function trackPartnerschaftlicheVerteilungForPlan(
  plan: PlanMitBeliebigenElternteilen,
): void {
  const elternteile = Object.keys(
    plan.ausgangslage.pseudonymeDerElternteile,
  ) as Elternteil[];

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
