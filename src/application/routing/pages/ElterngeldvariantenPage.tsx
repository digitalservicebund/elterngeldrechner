import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Page } from "./page";
import { Button } from "@/application/components";
import { ElterngeldvariantenDescriptions } from "@/application/features/elterngelderklaerung";
import { formSteps } from "@/application/routing/formSteps";

export function ElterngeldvariantenPage(): ReactNode {
  const navigate = useNavigate();
  const navigateToEinkommenPage = () => navigate(formSteps.einkommen.route);
  const navigateToRechnerUndPlanerPage = () =>
    navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.elterngeldvarianten}>
      <div className="flex flex-col gap-56">
        <div className="flex flex-col gap-32">
          <p>
            Elterngeld gibt es in 3 Varianten, die hier näher erklärt werden.
            Alle 3 Varianten können Sie im nächsten Schritt im Planer
            miteinander kombinieren. Paare können die Monate flexibel
            untereinander aufteilen. Während Sie Elterngeld bekommen ist es
            übrigens möglich, zusätzlich bis maximal 32 Stunden pro Woche zu
            arbeiten.
          </p>

          <ElterngeldvariantenDescriptions />
        </div>

        <div className="flex gap-16">
          <Button
            label="Zurück"
            buttonStyle="secondary"
            onClick={navigateToEinkommenPage}
          />

          <Button
            label="Zum Monatsplaner"
            onClick={navigateToRechnerUndPlanerPage}
          />
        </div>
      </div>
    </Page>
  );
}
