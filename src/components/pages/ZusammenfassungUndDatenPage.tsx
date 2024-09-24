import type { ReactNode } from "react";
import { UserFeedbackSection } from "@/components/molecules/UserFeedbackSection";
import { Button, PrintButton } from "@/components/atoms";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import { Zusammenfassung } from "@/features/planer";
import { useNavigateWithPlan } from "@/hooks/useNavigateWithPlan";

function ZusammenfassungUndDatenPage(): ReactNode {
  const { plan, navigateWithPlanState } = useNavigateWithPlan();
  const hasPlan = plan !== undefined;

  function navigateToPreviousStep(): void {
    navigateWithPlanState(formSteps.rechnerUndPlaner.route, plan);
  }

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <div className="flex flex-col items-start gap-y-32">
        {hasPlan ? (
          <>
            <Zusammenfassung plan={plan} />
            <PrintButton />
          </>
        ) : (
          "Es wurde noch kein Plan erstellt"
        )}

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />

        <UserFeedbackSection className="mt-40" />
      </div>
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
