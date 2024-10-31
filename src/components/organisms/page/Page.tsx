import { ReactNode, useEffect } from "react";
import classNames from "classnames";
import { AriaMessage } from "@/components/atoms";
import { FormStep } from "@/utils/formSteps";
import { Sidebar } from "@/components/organisms/sidebar";
import { Alert } from "@/components/molecules/alert";
import nsp from "@/globals/js/namespace";

interface PageProps {
  readonly step: FormStep;
  readonly children: ReactNode;
}

export function Page({ step, children }: PageProps) {
  // scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const alert = {
    "/allgemeine-angaben": {
      headline: "Gesetzesänderung",
      text: (
        <p>
          Für Geburten ab dem 1. April 2025 liegt die Einkommensgrenze für Paare
          und Alleinerziehende bei 175.000 Euro.
          <br />
          <br />
          Details finden Sie auf der{" "}
          <a
            href="https://familienportal.de/familienportal/meta/aktuelles/aktuelle-meldungen/neue-regelungen-beim-elterngeld-237908"
            target="_blank"
            rel="noreferrer"
          >
            Seite des Familienportals
          </a>
          .
        </p>
      ),
    },
    "/einkommen": {
      headline: "Gesetzesänderung",
      text: (
        <p>
          Für Geburten ab dem 1. April 2025 liegt die Einkommensgrenze für Paare
          und Alleinerziehende bei 175.000 Euro.
          <br />
          <br />
          Details finden Sie auf der{" "}
          <a
            href="https://familienportal.de/familienportal/meta/aktuelles/aktuelle-meldungen/neue-regelungen-beim-elterngeld-237908"
            target="_blank"
            rel="noreferrer"
          >
            Seite des Familienportals
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
      <div
        className={classNames(nsp("page__content"), "relative")}
        id={step.text}
      >
        {alert ? (
          <div style={{ marginBottom: "2rem" }}>
            <Alert headline={alert.headline}>{alert.text}</Alert>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}
