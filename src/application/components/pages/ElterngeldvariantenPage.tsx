import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Page } from "./page";
import { Button } from "@/application/components/atoms";
import { ButtonGroup } from "@/application/components/molecules";
import { ElterngeldvariantenDescriptions } from "@/application/features/elterngelderklaerung";

export function ElterngeldvariantenPage(): ReactNode {
  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.einkommen.route);
  const navigateToNextStep = () => navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.elterngeldvarianten}>
      <div className="flex basis-full flex-col gap-32">
        <p>
          Elterngeld gibt es in 3 Varianten, die hier näher erklärt werden. Alle
          3 Varianten können Sie im nächsten Schritt im Planer miteinander
          kombinieren. Paare können die Monate flexibel untereinander aufteilen.
          Während Sie Elterngeld bekommen ist es übrigens möglich, zusätzlich
          bis maximal 32 Stunden pro Woche zu arbeiten.
        </p>

        <ElterngeldvariantenDescriptions />
      </div>

      <ButtonGroup onClickBackButton={navigateToPreviousStep}>
        <Button label="Zum Monatsplaner" onClick={navigateToNextStep} />
      </ButtonGroup>
    </Page>
  );
}
