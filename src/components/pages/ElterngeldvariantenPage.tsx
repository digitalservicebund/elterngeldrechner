import { useNavigate } from "react-router-dom";
import { ReactNode, useId } from "react";
import { formSteps } from "@/utils/formSteps";
import { Page } from "@/components/organisms/page";
import { Button } from "@/components/atoms";
import { ElterngeldvariantenDescriptions } from "@/components/organisms/elterngeldvarianten";

export function ElterngeldvariantenPage(): ReactNode {
  const descriptionIdentifier = useId();

  const navigate = useNavigate();
  const navigateToPreviousStep = () => navigate(formSteps.einkommen.route);
  const navigateToNextStep = () => navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.elterngeldvarianten}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <section
          className="flex basis-full flex-col gap-24"
          aria-describedby={descriptionIdentifier}
        >
          <p id={descriptionIdentifier}>
            Elterngeld gibt es in 3 Varianten.
            <br />
            Hier finden Sie eine Übersicht über die einzelnen
            Elterngeldvarianten. Diese können Sie im nächsten Schritt
            miteinander kombinieren.
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
