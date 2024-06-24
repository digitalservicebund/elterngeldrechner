import { useId } from "react";
import { useNavigate } from "react-router-dom";
import { DatenInAntragUebernehmenButton } from "@/components/organisms/DatenInAntragUebernehmenButton";
import { Button, PrintButton } from "@/components/atoms";
import {
  Planungsuebersicht,
  Planungsdetails,
} from "@/components/organisms/planungsuebersicht";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import nsp from "@/globals/js/namespace";
import { usePlanungdaten } from "@/components/organisms/planungsuebersicht/usePlanungsdaten";

function ZusammenfassungUndDatenPage() {
  const descriptionIdentifier = useId();
  const data = usePlanungdaten();

  const navigate = useNavigate();
  const navigateToPreviousStep = () =>
    navigate(formSteps.rechnerUndPlaner.route);

  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <div className="mb-40 flex flex-wrap justify-between gap-y-80">
        <section
          className="flex basis-full flex-col gap-24"
          aria-describedby={descriptionIdentifier}
        >
          <h3>Zusammenfassung</h3>

          <p id={descriptionIdentifier}>
            Hier finden sie eine Übersicht Ihrer Planung der Elterngeldmonate
          </p>

          <Planungsuebersicht data={data} />
        </section>

        <section className="flex basis-full break-before-page break-inside-avoid flex-col gap-y-16">
          <h3>Planung der Monate im Detail</h3>

          <Planungsdetails data={data} />
        </section>
      </div>

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
    </Page>
  );
}

export default ZusammenfassungUndDatenPage;
