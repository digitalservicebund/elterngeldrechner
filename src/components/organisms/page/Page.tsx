import { FC } from "react";
import { AriaMessage } from "../../atoms";
import { FormStep } from "../../../utils/formSteps";
import { Sidebar } from "../sidebar";
import nsp from "../../../globals/js/namespace";
import { FootNote, Alert } from "../../molecules";

interface PageProps {
  step: FormStep;
  children: React.ReactNode;
}

export const Page: FC<PageProps> = ({ step, children }) => {
  const alert = {
    "/allgemeine-angaben": {
      headline: "Bitte achten Sie auf die neuen Gesetzesänderungen:",
      text: (
        <p>
          Für Geburten ab dem 01.04.2024 gibt es neue Regeln für das Elterngeld,
          die die Einkommensgrenze und die Möglichkeit, gleichzeitig Elterngeld
          zu beziehen, betreffen. Mehr Details dazu finden Sie auf der{" "}
          <a
            href="https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld/elterngeld-73752"
            target="_blank"
            rel="noreferrer"
          >
            Seite des Bundes-Familienministeriums
          </a>
          .
        </p>
      ),
    },
    "/einkommen": {
      headline:
        "Bitte beachten Sie: Die Einkommensgrenze ändert sich für Geburten ab dem 01.04.2024",
      text: (
        <p>
          Mehr Details dazu finden Sie auf der{" "}
          <a
            href="https://www.bmfsfj.de/bmfsfj/themen/familie/familienleistungen/elterngeld/elterngeld-73752"
            target="_blank"
            rel="noreferrer"
          >
            Seite des Bundes-Familienministeriums
          </a>
          .
        </p>
      ),
    },
  }[step.route];
  return (
    <div className={nsp("page")}>
      <div className={nsp("page__sidebar")}>
        <Sidebar currentStep={step} />
      </div>
      <AriaMessage>{step.text}</AriaMessage>
      <div className={nsp("page__content")}>
        {alert && (
          <div style={{ marginBottom: "2rem" }}>
            <Alert box headline={alert.headline}>
              {alert.text}
            </Alert>
          </div>
        )}
        <FootNote id={nsp("foot-note-for-required-fields")}>
          Die mit einem Stern (*) gekennzeichneten Felder sind Pflichtfelder und
          müssen ausgefüllt sein.
        </FootNote>
        {children}
      </div>
    </div>
  );
};
