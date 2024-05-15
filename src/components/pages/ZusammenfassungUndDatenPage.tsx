import { FC } from "react";
import { Page } from "@/components/organisms/page";
import { formSteps } from "@/utils/formSteps";
import { ZusammenfassungUndDaten } from "@/components/organisms/zusammenfassung-und-daten";

const ZusammenfassungUndDatenPage: FC = () => {
  return (
    <Page step={formSteps.zusammenfassungUndDaten}>
      <ZusammenfassungUndDaten />
    </Page>
  );
};

export default ZusammenfassungUndDatenPage;
