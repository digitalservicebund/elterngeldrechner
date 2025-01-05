import { ReactNode, useId } from "react";
import { useNavigate } from "react-router-dom";
import { formSteps } from "./formSteps";
import { Button } from "@/components/atoms";
import { ElterngeldvariantenDescriptions } from "@/components/organisms/elterngeldvarianten";
import { Page } from "@/components/organisms/page";

export function ElterngeldvariantenPage(): ReactNode {
  const descriptionIdentifier = useId();

  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.einkommen.route);
  const navigateToNextStep = () => navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.elterngeldvarianten}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <section
          className="flex basis-full flex-col gap-32"
          aria-describedby={descriptionIdentifier}
        >
          <h2>Elterngeldvarianten</h2>

          <p id={descriptionIdentifier}>
            Elterngeld gibt es in 3 Varianten, die hier näher erklärt werden.
            Alle 3 Varianten können Sie im nächsten Schritt im Planer
            miteinander kombinieren. Paare können die Monate flexibel
            untereinander aufteilen. Während Sie Elterngeld bekommen ist es
            übrigens möglich, zusätzlich bis maximal 32 Stunden pro Woche zu
            arbeiten.
          </p>

          <ElterngeldvariantenDescriptions />
        </section>

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />

        <Button label="Zum Monatsplaner" onClick={navigateToNextStep} />
      </div>
    </Page>
  );
}
