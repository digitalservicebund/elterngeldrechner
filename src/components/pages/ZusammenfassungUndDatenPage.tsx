import type { ReactNode } from "react";
import { UserFeedbackSection } from "@/components/molecules/UserFeedbackSection";
import { DatenInAntragUebernehmenButton } from "@/components/organisms/DatenInAntragUebernehmenButton";
import { Button, PrintButton } from "@/components/atoms";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import nsp from "@/globals/js/namespace";
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

        <section className={nsp("monatsplaner__button-group")}>
          <Button
            buttonStyle="secondary"
            label="Zurück"
            onClick={navigateToPreviousStep}
          />

          <DatenInAntragUebernehmenButton />
        </section>
      </div>

      <UserFeedbackSection className="mt-40" />
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
