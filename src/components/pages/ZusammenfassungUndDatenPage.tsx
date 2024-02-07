import { FC } from "react";
import { Page } from "../organisms/page";
import { formSteps } from "../../utils/formSteps";
import { ZusammenfassungUndDaten } from "../organisms/zusammenfassung-und-daten";

const ZusammenfassungUndDatenPage: FC = () => {
  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <ZusammenfassungUndDaten />
    </Page>
  );
};

export default ZusammenfassungUndDatenPage;
