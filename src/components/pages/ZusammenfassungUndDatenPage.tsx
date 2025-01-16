import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import type { ReactNode } from "react";
import { formSteps } from "./formSteps";
import { useNavigateWithPlan } from "./useNavigateWithPlan";
import { Button } from "@/components/atoms";
import { ButtonGroup } from "@/components/molecules";
import { Page } from "@/components/organisms/page";
import { Zusammenfassung } from "@/features/planer/user-interface";

function ZusammenfassungUndDatenPage(): ReactNode {
  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const hasPlan = plan !== undefined;

  function navigateToPreviousStep(): void {
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);
  }

  function print(): void {
    window.print();
  }

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      {hasPlan ? (
        <>
          <Zusammenfassung plan={plan} />

          <div className="mt-32">
            <Button
              buttonStyle="link"
              label="Download der Planung"
              iconBefore={<SaveAltIcon />}
              onClick={print}
            />
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
