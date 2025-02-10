import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router-dom";
import { Alert } from "@/components/molecules/alert";
import { Sidebar } from "@/components/organisms/sidebar";
import { FormStep, StepRoute, formSteps } from "@/components/pages/formSteps";

interface PageProps {
  readonly step: FormStep;
  readonly children: ReactNode;
}

export function Page({ step, children }: PageProps) {
  const alert = ALERTS[step.route as StepRoute];

  const sectionElement = useRef<HTMLElement>(null);
  useEffect(() => sectionElement.current?.focus(), []);

  const headingIdentifier = useId();

  return (
    <div className="egr-page">
      <ScrollRestoration />

      <div className="egr-page__sidebar">
        <Sidebar currentStep={step} />
      </div>

      <section
        id={step.heading} /* used for tracking */
        ref={sectionElement}
        className="egr-page__content relative focus:outline-none"
        aria-labelledby={headingIdentifier}
        tabIndex={-1}
      >
        {!!alert && (
          <Alert headline={alert.headline} className="mb-32">
            {alert.text}
          </Alert>
        )}

        <h2 id={headingIdentifier} className="mb-10 print:m-0">
          {step.heading}
        </h2>

        {children}
      </section>
    </div>
  );
}

const ALERTS: Partial<Record<StepRoute, Alert>> = {
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

type Alert = { headline: string; text: ReactNode };
