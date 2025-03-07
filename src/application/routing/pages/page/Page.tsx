import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Alert } from "@/application/components";
import {
  FormStep,
  StepRoute,
  formSteps,
} from "@/application/routing/formSteps";

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
    <div className="page-grid-container print:block">
      <ScrollRestoration />

      <div className="page-grid-sidebar relative min-[1170px]:mr-56 print:hidden">
        <Sidebar currentStep={step} />
      </div>

      <section
        id={step.heading} /* used for tracking */
        ref={sectionElement}
        className="page-grid-content relative focus:outline-none"
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
