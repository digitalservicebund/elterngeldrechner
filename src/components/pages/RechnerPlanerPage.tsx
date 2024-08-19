import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { AccessControl } from "@/components/molecules";
import { Button } from "@/components/atoms";
import { useAppSelector } from "@/redux/hooks";
import { formSteps } from "@/utils/formSteps";
import { Rechner } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import ModalPopup from "@/components/organisms/modal-popup/ModalPopup";
import { YesNo } from "@/globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { EgrBerechnungParamId } from "@/globals/js/calculations/model/egr-berechnung-param-id";
import { Planer } from "@/features/planer";
import { stepRechnerSelectors } from "@/redux/stepRechnerSlice";

function RechnerPlanerPage() {
  const sectionLabelIdentifier = useId();

  const isPlanerBlocked = useAppSelector(
    stepRechnerSelectors.isMonatsplanerOverlayVisible,
  );

  const isLimitEinkommenUeberschritten = useAppSelector((state) =>
    state.stepEinkommen.limitEinkommenUeberschritten === YesNo.YES
      ? true
      : null,
  );
  const [showModalPopup, setShowModalPopup] = useState<boolean | null>(
    isLimitEinkommenUeberschritten,
  );
  const alleinerziehend = useAppSelector(
    stepAllgemeineAngabenSelectors.getAlleinerziehend,
  );

  const amountLimitEinkommen =
    alleinerziehend === YesNo.YES
      ? EgrBerechnungParamId.MAX_EINKOMMEN_ALLEIN
      : EgrBerechnungParamId.MAX_EINKOMMEN_BEIDE;

  const navigate = useNavigate();
  const navigateToPreviousStep = () =>
    navigate(formSteps.elterngeldvarianten.route);
  const navigateToNextStep = () =>
    navigate(formSteps.zusammenfassungUndDaten.route);

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <div className="flex flex-wrap justify-between gap-y-80">
        <section
          className="basis-full"
          aria-labelledby={sectionLabelIdentifier}
        >
          <h3 id={sectionLabelIdentifier} className="mb-10">
            Rechner und Planer
          </h3>

          <Rechner />

          <div className="relative">
            {!!isPlanerBlocked && <AccessControl />}
            <Planer className={classNames({ blur: isPlanerBlocked })} />
          </div>
        </section>

        <Button
          buttonStyle="secondary"
          label="Zurück"
          onClick={navigateToPreviousStep}
        />
        <Button label="Zur Übersicht" onClick={navigateToNextStep} />
      </div>

      {!!showModalPopup && (
        // TODO: fix text after check with ministry
        <ModalPopup
          text={`Wenn Sie besonders viel Einkommen haben, können Sie kein Elterngeld bekommen. Falls noch nicht feststeht, ob Sie die Grenze von ${amountLimitEinkommen.toLocaleString()} Euro überschreiten, können Sie trotzdem einen Antrag stellen.`}
          buttonLabel="Dialog schließen"
          onClick={() => {
            setShowModalPopup(false);
          }}
        />
      )}
    </Page>
  );
}

export default RechnerPlanerPage;
