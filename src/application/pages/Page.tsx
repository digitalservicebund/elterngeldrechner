import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FormStep } from "@/application/routing/formSteps";

type Props = {
  readonly step: FormStep;
  readonly children: ReactNode;
  readonly customHeading?: string;
  readonly navigationDetails?: string;
};

export function Page({
  step,
  children,
  customHeading,
  navigationDetails,
}: Props) {
  const sectionElement = useRef<HTMLElement>(null);
  useEffect(() => {
    sectionElement.current?.focus({ preventScroll: true });
  }, []);

  const headingIdentifier = useId();

  return (
    <div className="page-grid-container print:block">
      <ScrollRestoration />

      <div className="page-grid-sidebar relative min-[1170px]:mr-56 print:hidden">
        <Sidebar currentStep={step} navigationDetails={navigationDetails} />
      </div>

      <section
        id={step.heading} /* used for tracking */
        ref={sectionElement}
        className="page-grid-content relative focus:outline-none"
        aria-labelledby={headingIdentifier}
        tabIndex={-1}
      >
        <h2 id={headingIdentifier} className="mb-10 print:m-0">
          {customHeading ? customHeading : step.heading}
        </h2>

        {children}
      </section>
    </div>
  );
}
