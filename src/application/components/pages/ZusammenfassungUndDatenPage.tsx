import type { ReactNode } from "react";
import { formSteps } from "./formSteps";
import { Page } from "./page";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { ButtonGroup, PrintButton } from "@/application/components/molecules";
import { Zusammenfassung } from "@/application/features/planer";

function ZusammenfassungUndDatenPage(): ReactNode {
  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const hasPlan = plan !== undefined;

  function navigateToPreviousStep(): void {
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);
  }

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      {hasPlan ? (
        <>
          <Zusammenfassung plan={plan} />

          <div className="mt-32 print:hidden">
            <PrintButton />
          </div>
        </>
      ) : (
        "Es wurde noch kein Plan erstellt"
      )}

      <ButtonGroup onClickBackButton={navigateToPreviousStep}>
        <span>{/* Send data to ElterngeldDigital */}</span>
      </ButtonGroup>
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
