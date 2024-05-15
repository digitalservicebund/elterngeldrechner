import { useState } from "react";
import { useAppSelector } from "@/redux/hooks";
import { formSteps } from "@/utils/formSteps";
import { Monatsplaner, Rechner } from "@/components/organisms";
import { Page } from "@/components/organisms/page";
import { numberOfMutterschutzMonths } from "@/globals/js/elternteile-utils";
import ModalPopup from "@/components/organisms/modal-popup/ModalPopup";
import { YesNo } from "@/globals/js/calculations/model";
import { stepAllgemeineAngabenSelectors } from "@/redux/stepAllgemeineAngabenSlice";
import { EgrBerechnungParamId } from "@/globals/js/calculations/model/egr-berechnung-param-id";

const RechnerPlanerPage = () => {
  const nachwuchs = useAppSelector((state) => state.stepNachwuchs);
  const allgemein = useAppSelector((state) => state.stepAllgemeineAngaben);
  const isLimitEinkommenUeberschritten = useAppSelector((state) =>
    state.stepEinkommen.limitEinkommenUeberschritten === YesNo.YES
      ? true
      : null,
  );
  const mutterSchutzMonate = numberOfMutterschutzMonths(
    nachwuchs.anzahlKuenftigerKinder,
    allgemein.mutterschaftssleistungen,
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

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <h3>Rechner und Planer</h3>
      <Rechner />
      <Monatsplaner mutterSchutzMonate={mutterSchutzMonate} />
      {showModalPopup && (
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
};

export default RechnerPlanerPage;
