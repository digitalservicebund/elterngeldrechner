import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { generatePath, useLocation, useNavigate } from "react-router";
import { Route } from "@/application/features/abfrageteil-next/routing/Route";
import { generateAbfrageteilPath } from "@/application/features/abfrageteil-next/routing/routeDefinition";
import { useOnFocusMovedOut } from "@/application/hooks/useOnFocusMovedOut";

type NavigationItem = NavigationStep & {
  readonly navigatable: boolean;
};

type NavigationStep = {
  readonly label: string;
  readonly path: string;
};

const navigationSteps: NavigationStep[] = [
  { label: "Startseite", path: generateAbfrageteilPath(Route.Startseite) },
  {
    label: "Angaben zur Familie",
    path: generateAbfrageteilPath(Route.AllgemeineAngaben),
  },
  {
    label: "Angaben zum Kind",
    path: generateAbfrageteilPath(Route.KindAbfrage),
  },
  {
    label: "Angaben zu Geschwistern",
    path: generateAbfrageteilPath(Route.GeschwisterkindAbfrage),
  },
  {
    label: "Angaben Person 1",
    path: generatePath(
      generateAbfrageteilPath(Route.ElternteilAllgemeineAngaben),
      { index: "0" },
    ),
  },
  {
    label: "Angaben Person 2",
    path: generatePath(
      generateAbfrageteilPath(Route.ElternteilAllgemeineAngaben),
      { index: "1" },
    ),
  },
  { label: "Planungshilfen", path: "/beispiele" },
  {
    label: "Planung und Berechnung",
    path: "/rechner-planer",
  },
  {
    label: "Übernahme Planung in Antrag",
    path: "/datenuebernahme-antrag",
  },
];

function erstelleNavigationsItems(pathname: string) {
  const currentIndex = navigationSteps.findIndex(
    ({ path }) => path === pathname,
  );
  const stepsBeforeCurrentStep = navigationSteps.slice(0, currentIndex);
  const stepsAfterCurrentStep = navigationSteps.slice(currentIndex);
  return [
    ...stepsBeforeCurrentStep.map((step) => ({
      ...step,
      navigatable: true,
    })),
    ...stepsAfterCurrentStep.map((step) => ({
      ...step,
      navigatable: false,
    })),
  ];
}

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const navigationElement = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOnFocusMovedOut(navigationElement, closeMenu);

  const navigationItems: NavigationItem[] = useMemo(() => {
    return erstelleNavigationsItems(pathname);
  }, [pathname]);

  const currentStepIndex = navigationItems.findIndex(
    (item) => item.path === pathname,
  );
  const currentStepNumber = currentStepIndex + 1;
  const totalStepCount = navigationItems.length;
  const currentLabel = navigationItems[currentStepIndex]?.label ?? "";

  const toggleButtonIdentifier = useId();
  const toggleButtonAriaLabel = `Schritt ${currentStepNumber} von ${totalStepCount}: ${currentLabel}`;

  const twClasses = {
    navbar: "m-0 list-none p-0 max-[1169px]:mb-40",
    navbarActivatorLarge: "hidden text-nowrap px-24 py-16",
    navbarActivatorSmall:
      "max-[1169px]:text-16 max-[1169px]:flex max-[1169px]:w-full max-[1169px]:items-center max-[1169px]:justify-between max-[1169px]:border-none max-[1169px]:bg-primary-light max-[1169px]:text-black",

    menuBase: "counter-item-reset m-0 list-none p-0",
    menuClosed: "max-[1169px]:invisible max-[1169px]:absolute",
    menuOpen:
      "transition-height visible absolute left-0 top-56 z-[1] min-h-[25rem] w-full border-0 border-b-2 border-solid border-white bg-primary-light px-24 py-16 text-16 opacity-100 transition-opacity duration-500",

    stepBase: "relative",
    stepDivider:
      "mb-24 after:absolute after:-bottom-24 after:left-16 after:min-h-24 after:min-w-1 after:bg-grey-dark after:content-['']",
    stepCurrent:
      "before:border-2 before:border-primary before:bg-primary-light max-[1169px]:before:bg-white",
    stepDone: "before:border-primary before:bg-primary before:text-white",
    stepCircle:
      "before:font-[Arial] before:content-[counter(item)] before:mr-16 before:inline-flex before:size-32 before:items-center before:justify-center before:rounded-full before:border before:border-solid before:border-grey-dark",

    stepHeading:
      "appearance-none border-none bg-transparent text-16 text-black",
  };

  return (
    <nav
      ref={navigationElement}
      style={{ counterReset: "item" }}
      className={twClasses.navbar}
      aria-label="Fortschritt"
    >
      <button
        id={toggleButtonIdentifier}
        className={classNames(
          twClasses.navbarActivatorLarge,
          twClasses.navbarActivatorSmall,
        )}
        type="button"
        onClick={toggleMenu}
        aria-label={toggleButtonAriaLabel}
        aria-expanded={isOpen}
      >
        <span>
          <strong className="mr-20">
            {currentStepNumber}/{totalStepCount}
          </strong>
          {currentLabel}
        </span>

        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>

      <ol
        className={classNames({
          [twClasses.menuBase]: true,
          [twClasses.menuOpen]: isOpen,
          [twClasses.menuClosed]: !isOpen,
        })}
        aria-controls={toggleButtonIdentifier}
      >
        {navigationItems.map((item, index) => {
          const isCurrent = index === currentStepIndex;
          const isDone = index < currentStepIndex;
          const isDisabled = !item.navigatable;
          const hasFollowing = index !== totalStepCount - 1;

          return (
            <li
              key={item.path + index}
              style={{ counterIncrement: "item" }}
              className={classNames({
                [twClasses.stepBase]: true,
                [twClasses.stepCircle]: true,
                [twClasses.stepDone]: isDone,
                [twClasses.stepCurrent]: isCurrent,
                [twClasses.stepDivider]: hasFollowing,
              })}
            >
              <button
                className={classNames(twClasses.stepHeading, {
                  "cursor-default": isDisabled,
                })}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={isCurrent ? "step" : undefined}
                disabled={isDisabled}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstelleNavigationsItems", () => {
    it("returns list of NavigationItems with lenght 9 and all navigatable false", () => {
      const result = erstelleNavigationsItems(
        generateAbfrageteilPath(Route.Startseite),
      );

      expect(result.map((item) => item.navigatable)).toEqual([
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });

    it("returns list of NavigationItems with lenght 9 and all navigatable before Route.KindeAbfrage true and all others false", () => {
      const result = erstelleNavigationsItems(
        generateAbfrageteilPath(Route.KindAbfrage),
      );

      expect(result.map((item) => item.navigatable)).toEqual([
        true,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ]);
    });
  });
}
