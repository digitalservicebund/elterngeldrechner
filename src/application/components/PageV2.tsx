import { ReactNode, useEffect, useId, useRef } from "react";
import { ScrollRestoration } from "react-router";
import { SidebarV2 } from "./SidebarV2";

type Props = {
  readonly children: ReactNode;
  readonly heading: string;
  readonly navigationItems: string[];
  readonly currentNavigationItem: string;
};

export function PageV2({
  children,
  heading,
  navigationItems,
  currentNavigationItem,
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
        <SidebarV2
          navigationItems={navigationItems}
          currentNavigationItem={currentNavigationItem}
        />
      </div>

      <section
        id={currentNavigationItem}
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
