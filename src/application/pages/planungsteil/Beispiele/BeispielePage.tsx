import { useState } from "react";
import { useNavigate } from "react-router";
import { trackMetricsForEinBeispielWurdeAusgewaehlt } from "./tracking";
import { Button } from "@/application/components";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import { BeispielAuswahlbox } from "@/application/features/beispiele/component/BeispielAuswahlbox";
import { BeispielAuswahloptionLegende } from "@/application/features/beispiele/component/BeispielAuswahloptionLegende";
import { useBeispieleService } from "@/application/features/beispiele/hooks";
import { Page } from "@/application/pages/Page";
import { useBerechneElterngeldbezuege } from "@/application/pages/planungsteil/useBerechneElterngeldbezuege";
import { useNavigateWithPlan } from "@/application/pages/planungsteil/useNavigateWithPlan";
import { useAppStore } from "@/application/redux/hooks";
import { formSteps } from "@/application/routing/formSteps";
import { PlanMitBeliebigenElternteilen } from "@/monatsplaner";

export function BeispielePage() {
  const store = useAppStore();
  const navigate = useNavigate();

  const { navigateWithPlanState } = useNavigateWithPlan();

  const navigateToEinkommenPage = async () => {
    await navigate(formSteps.einkommen.route);
  };
  const navigateToRechnerUndPlanerPage = async () => {
    await navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);
  };

  const ausgangslage = composeAusgangslageFuerPlaner(store.getState());
  const [plan, setPlan] = useState<PlanMitBeliebigenElternteilen>();

  const { beispiele } = useBeispieleService(ausgangslage, setPlan, {
    onWaehleBeispielAus: trackMetricsForEinBeispielWurdeAusgewaehlt,
  });

  const { berechneElterngeldbezuegeByPlan } = useBerechneElterngeldbezuege();

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-56">
        <BeispielAuswahloptionLegende beispiele={beispiele} />

        <div className="grid grid-cols-1 gap-26 md:grid-cols-2">
          {beispiele.map((beispiel) => (
            <BeispielAuswahlbox
              key={beispiel.identifier}
              berechneElterngeldbezuege={berechneElterngeldbezuegeByPlan}
              beispiel={beispiel}
            />
          ))}

          <div className="flex flex-col rounded bg-off-white p-24 md:col-span-2">
            <h4>Eigene Planung anlegen</h4>
            <p>
              Sie probieren selbst aus, wie Sie Ihr Elterngeld aufteilen und
              erstellen Sie eine Planung ohne Planungshilfe.
            </p>
          </div>
        </div>

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
            buttonStyle="primary"
            onClick={navigateToRechnerUndPlanerPage}
          >
            Weiter
          </Button>
        </div>
      </div>
    </Page>
  );
}
