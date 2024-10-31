import { ReactNode } from "react";
import classNames from "classnames";
import { ScrollRestoration } from "react-router-dom";
import { AriaMessage } from "@/components/atoms";
import { FormStep, formSteps } from "@/utils/formSteps";
import { Sidebar } from "@/components/organisms/sidebar";
import { Alert } from "@/components/molecules/alert";
import nsp from "@/globals/js/namespace";

interface PageProps {
  readonly step: FormStep;
  readonly children: ReactNode;
}

export function Page({ step, children }: PageProps) {
  const alert = ALERTS[step.route];

  return (
    <div className={nsp("page")}>
      <ScrollRestoration />

      <div className={nsp("page__sidebar")}>
        <Sidebar currentStep={step} />
      </div>

      <AriaMessage>{step.text}</AriaMessage>

      <div
        id={step.text}
        className={classNames(nsp("page__content"), "relative")}
      >
        {!!alert && (
          <Alert headline={alert.headline} className="mb-32">
            {alert.text}
          </Alert>
        )}
        {children}
      </div>
    </div>
  );
}

const ALERTS = {
  [formSteps.allgemeinAngaben.route]: {
    headline: "Gesetzesänderung",
    text: (
      <p>
        Für Geburten ab dem 1. April 2025 liegt die Einkommensgrenze für Paare
        und Alleinerziehende bei 175.000 Euro.
      </p>
    ),
  },
  [formSteps.einkommen.route]: {
    headline: "Gesetzesänderung",
    text: (
      <p>
        Für Geburten ab dem 1. April 2025 liegt die Einkommensgrenze für Paare
        und Alleinerziehende bei 175.000 Euro.
      </p>
    ),
  },
};
