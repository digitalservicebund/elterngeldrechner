import { useNavigate } from "react-router-dom";
import { UserFeedbackSection } from "@/components/molecules/UserFeedbackSection";
import { DatenInAntragUebernehmenButton } from "@/components/organisms/DatenInAntragUebernehmenButton";
import { Button, PrintButton } from "@/components/atoms";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import nsp from "@/globals/js/namespace";

function ZusammenfassungUndDatenPage() {
  const navigate = useNavigate();
  const navigateToPreviousStep = () =>
    navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <div className="flex flex-col gap-y-32">
        <div>
          <PrintButton />
        </div>

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
