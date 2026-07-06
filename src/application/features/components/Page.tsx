import classNames from "classnames";
import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration, useLocation } from "react-router";
import { Sidebar } from "./Sidebar";
import { Route, generateAbfrageteilPath } from "@/application/routing";

type Props = {
  readonly id?: string;
  readonly children: ReactNode;
  readonly heading: string;
};

export function Page({ id, children, heading }: Props) {
  const { pathname } = useLocation();

  const sectionElement = useRef<HTMLElement>(null);
  useEffect(() => {
    sectionElement.current?.focus({ preventScroll: true });
  }, []);

  const headingIdentifier = useId();

  const isPastStartseite = !pathname.startsWith(
    generateAbfrageteilPath(Route.Startseite),
  );

  return (
    <div id={id} className="page-grid-container print:block">
      <ScrollRestoration />

      <div
        className={classNames("page-grid-sidebar relative print:hidden", {
          "min-[1170px]:mr-56": isPastStartseite,
        })}
      >
        {isPastStartseite ? <Sidebar /> : null}
      </div>

      <section
        ref={sectionElement}
        className="page-grid-content relative focus:outline-none max-[1169px]:mt-20"
        aria-labelledby={headingIdentifier}
        tabIndex={-1}
      >
        <p id={headingIdentifier} className="preline-default">
          {heading}
        </p>

        {children}
      </section>
    </div>
  );
}
