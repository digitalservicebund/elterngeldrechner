import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router";
import { Sidebar } from "./Sidebar";
import { isAbfrageteilNextEnabled } from "@/application/feature-flags";
import { Sidebar as SidebarNext } from "@/application/features/abfrageteil-next/components/Sidebar";
import { FormStep } from "@/application/routing/formSteps";

type Props = {
  readonly id?: string;
  readonly step: FormStep;
  readonly children: ReactNode;
};

export function Page({ id, step, children }: Props) {
  const sectionElement = useRef<HTMLElement>(null);
  useEffect(() => {
    sectionElement.current?.focus({ preventScroll: true });
  }, []);

  const headingIdentifier = useId();

  return (
    <div id={id} className="page-grid-container print:block">
      <ScrollRestoration />

      <div className="page-grid-sidebar relative min-[1170px]:mr-56 print:hidden">
        {isAbfrageteilNextEnabled() ? (
          <SidebarNext />
        ) : (
          <Sidebar currentStep={step} />
        )}
      </div>

      <section
        id={step.heading} /* used for tracking */
        ref={sectionElement}
        className="page-grid-content relative focus:outline-none"
        aria-labelledby={headingIdentifier}
        tabIndex={-1}
      >
        <h2 id={headingIdentifier} className="mb-10 print:m-0">
          {step.heading}
        </h2>

        {children}
      </section>
    </div>
  );
}
