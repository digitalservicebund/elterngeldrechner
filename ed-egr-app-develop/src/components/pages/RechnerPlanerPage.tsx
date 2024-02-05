import { useState } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useNavigate } from "react-router-dom";
import { formSteps } from "../../utils/formSteps";
import { Monatsplaner, Rechner } from "../organisms";
import { Page } from "../organisms/page";
import { numberOfMutterschutzMonths } from "../../globals/js/elternteile-utils";
import ModalPopup from "../organisms/modal-popup/ModalPopup";

const RechnerPlanerPage = () => {
  const nachwuchs = useAppSelector((state) => state.stepNachwuchs);
  const allgemein = useAppSelector((state) => state.stepAllgemeineAngaben);
  const navigate = useNavigate();
  const { limitEinkommenUeberschritten } = useAppSelector(
    (state) => state.stepEinkommen,
  );
  const mutterSchutzMonate = numberOfMutterschutzMonths(
    nachwuchs.anzahlKuenftigerKinder,
    allgemein.mutterschaftssleistungen,
  );
  const [showModalPopup, setShowModalPopup] = useState<boolean | null>(
    limitEinkommenUeberschritten,
  );

  return (
    <Page step={formSteps.rechnerUndPlaner}>
      <Rechner />
      <Monatsplaner mutterSchutzMonate={mutterSchutzMonate} />
      {showModalPopup && (
        // TODO: fix text after check with ministry
        <ModalPopup
          text=" Wenn Sie zusammen mehr als 300.000 Euro oder alleine mehr als 250.000 € Einkommen im Jahr haben, können Sie kein Elterngeld bekommen. Dabei zählt das zu versteuernde Einkommen im letzten abgeschlossenen Kalenderjahr vor der Geburt."
          buttonLabel="Zurück zum Einkommen"
          onClick={() => {
            setShowModalPopup(false);
            navigate(formSteps.einkommen.route);
          }}
        />
      )}
    </Page>
  );
};

export default RechnerPlanerPage;
