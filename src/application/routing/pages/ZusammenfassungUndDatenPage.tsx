import type { ReactNode } from "react";
import { Page } from "./page";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { Button, PrintButton } from "@/application/components";
import { Zusammenfassung } from "@/application/features/planer";
import { formSteps } from "@/application/routing/formSteps";

export function ZusammenfassungUndDatenPage(): ReactNode {
  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const hasPlan = plan !== undefined;

  const navigateToRechnerUndPlanerPage = () =>
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <div className="flex flex-col gap-56">
        {hasPlan ? (
          <div>
            <Zusammenfassung plan={plan} />

            <div className="mt-32 print:hidden">
              <PrintButton />
            </div>
          </div>
        ) : (
          "Es wurde noch kein Plan erstellt"
        )}

        <Button
          className="place-self-start"
          label="Zurück"
          buttonStyle="secondary"
          onClick={navigateToRechnerUndPlanerPage}
        />
      </div>
    </Page>
  );
}
