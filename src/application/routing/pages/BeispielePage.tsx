import { useState } from "react";
import { useNavigate } from "react-router";
import { Page } from "./Page";
import { trackMetricsForEinBeispielWurdeAusgewaehlt } from "./RechnerUndPlanerPage/tracking";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { Button } from "@/application/components";
import { composeAusgangslageFuerPlaner } from "@/application/features/abfrageteil/state";
import { BeispielAuswahlbox } from "@/application/features/beispiele/component/BeispielAuswahlbox";
import { BeispielLegend } from "@/application/features/beispiele/component/BeispielLegend";
import { useBeispieleService } from "@/application/features/beispiele/hooks";
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

  return (
    <Page step={formSteps.beispiele}>
      <div className="flex flex-col gap-56">
        <BeispielLegend />

        <div className="flex flex-wrap gap-26">
          {beispiele.map((beispiel) => (
            <BeispielAuswahlbox key={beispiel.identifier} beispiel={beispiel} />
          ))}
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
