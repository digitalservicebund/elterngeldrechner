import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useOnFocusMovedOut } from "@/application/hooks/useOnFocusMovedOut";

type NavigationItem = {
  readonly label: string;
  readonly path: string;
  readonly navigatable: boolean;
};

const staticSteps: Omit<NavigationItem, "navigatable">[] = [
  { label: "Startseite", path: "/abfrageteil/startseite" },
  {
    label: "Angaben zur Familie",
    path: "/abfrageteil/allgemeine-angaben",
  },
  {
    label: "Angaben zum Kind",
    path: "/abfrageteil/kind",
  },
  {
    label: "Angaben zu Geschwistern",
    path: "/abfrageteil/geschwister",
  },
  {
    label: "Angaben Person 1",
    path: "/abfrageteil/elternteil/0",
  },
  {
    label: "Angaben Person 2",
    path: "/abfrageteil/elternteil/1",
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

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const navigationElement = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOnFocusMovedOut(navigationElement, closeMenu);

  const navigationItems: NavigationItem[] = useMemo(() => {
    const currentIndex = staticSteps.findIndex(({ path }) => path === pathname);
    const stepsBeforeCurrentStep = staticSteps.slice(0, currentIndex);
    const stepsAfterCurrentStep = staticSteps.slice(currentIndex);
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
          const isNavigatable = item.navigatable;
          const isLast = index === totalStepCount - 1;

          return (
            <li
              key={item.path + index}
              style={{ counterIncrement: "item" }}
              className={classNames({
                [twClasses.stepBase]: true,
                [twClasses.stepCircle]: true,
                [twClasses.stepCurrent]: isCurrent,
                [twClasses.stepDone]: isDone,
                [twClasses.stepDivider]: !isLast,
              })}
            >
              <button
                className={classNames(twClasses.stepHeading, {
                  "cursor-default": !isNavigatable,
                })}
                type="button"
                onClick={() => navigate(item.path)}
                aria-current={isCurrent ? "step" : undefined}
                disabled={!isNavigatable}
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
