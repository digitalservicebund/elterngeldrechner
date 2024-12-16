import type { ReactNode } from "react";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import { Button } from "@/components/atoms";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import { Zusammenfassung } from "@/features/planer/user-interface";
import { useNavigateWithPlan } from "@/hooks/useNavigateWithPlan";

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
      <div className="flex flex-col items-start gap-y-32">
        {hasPlan ? (
          <>
            <Zusammenfassung plan={plan} />

            <Button
              buttonStyle="link"
              label="Download der Planung"
              iconBefore={<SaveAltIcon />}
              onClick={print}
            />
          </>
        ) : (
          "Es wurde noch kein Plan erstellt"
        )}

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />
      </div>
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
