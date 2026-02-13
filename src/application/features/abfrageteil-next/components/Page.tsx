import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router";
import { Sidebar } from "./Sidebar";

type Props = {
  readonly children: ReactNode;
  readonly heading: string;
};

export function Page({ children, heading }: Props) {
  const sectionElement = useRef<HTMLElement>(null);
  useEffect(() => {
    sectionElement.current?.focus({ preventScroll: true });
  }, []);

  const headingIdentifier = useId();

  return (
    <div className="page-grid-container print:block">
      <ScrollRestoration />

      <div className="page-grid-sidebar relative min-[1170px]:mr-56 print:hidden">
        <Sidebar />
      </div>

      <section
        ref={sectionElement}
        className="page-grid-content relative focus:outline-none"
        aria-labelledby={headingIdentifier}
        tabIndex={-1}
      >
        <h2 id={headingIdentifier} className="mb-10 print:m-0">
          {heading}
        </h2>

        {children}
      </section>
    </div>
  );
}
