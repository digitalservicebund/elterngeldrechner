import classNames from "classnames";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { generatePath, useLocation, useNavigate } from "react-router";
import { useEventContext } from "@/application/features/abfrageteil/events/EventContext";
import { Route, generateAbfrageteilPath } from "@/application/routing";
import { useOnFocusMovedOut } from "@/application/hooks/useOnFocusMovedOut";
import ExpandLessIcon from "~icons/material-symbols/expand-less";
import ExpandMoreIcon from "~icons/material-symbols/expand-more";
import posthog from "posthog-js";

type NavigationItem = NavigationStep & {
  readonly navigatable: boolean;
};

type NavigationStep = {
  readonly label: string;
  readonly placeholder?: string;
  readonly personName?: () => string | undefined;
  readonly matchingPath: string;
  readonly navigatePath?: string;
};

function displayLabel(step: NavigationStep): string {
  return step.placeholder
    ? `${step.label} ${step.personName?.() ?? step.placeholder}`
    : step.label;
}

function analyticsLabel(step: NavigationStep): string {
  return step.placeholder ? `${step.label} ${step.placeholder}` : step.label;
}

function erstelleNavigationsItems(
  navigationSteps: NavigationStep[],
  pathname: string,
): NavigationItem[] {
  const currentIndex = navigationSteps.findLastIndex(({ matchingPath }) => {
    return pathname.startsWith(matchingPath);
  });

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
  const { findeLetztesGueltigesEvent } = useEventContext();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen((prev) => !prev), []);

  const navigationElement = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOnFocusMovedOut(navigationElement, closeMenu);

  // TODO: Implement adapter that hides the raw events

  const person1Event = findeLetztesGueltigesEvent(
    Route.ElternteilEinsAllgemeineAngaben,
  );
  const zweitePersonEvent = findeLetztesGueltigesEvent(
    Route.ElternteilZweiAllgemeineAngaben,
  );

  const person1Name = person1Event?.name;
  const person2Name = zweitePersonEvent?.name;
  const istNichtAlleinerziehend = person1Event?.istAlleinerziehend === false;

  const zeigePerson2Finanzielle =
    zweitePersonEvent !== undefined &&
    zweitePersonEvent.wirdZweitePersonBeruecksichtigt !== false;

  const navigationSteps = useMemo<NavigationStep[]>(() => {
    const schritte: NavigationStep[] = [
      {
        label: "Allgemeine Angaben",
        matchingPath: generateAbfrageteilPath(Route.AllgemeineAngaben),
      },
      {
        label: "Angaben zum Kind",
        matchingPath: generateAbfrageteilPath(Route.KindAbfrage),
      },
      {
        label: "Angaben zu Geschwistern",
        matchingPath: generateAbfrageteilPath(Route.GeschwisterkindAbfrage),
      },
      {
        label: "Angaben",
        placeholder: "Person 1",
        personName: () => person1Name,
        matchingPath: generateAbfrageteilPath(
          Route.ElternteilEinsAllgemeineAngaben,
        ),
      },
      {
        label: "Finanzielle Situation",
        placeholder: "Person 1",
        personName: () => person1Name,
        matchingPath: generatePath(
          generateAbfrageteilPath("/elternteil/:elternteilIndex/finanzielles/"),
          { elternteilIndex: "0" },
        ),
        navigatePath: generatePath(
          generateAbfrageteilPath(Route.ElternteilTaetigkeitenAbfrage),
          { elternteilIndex: "0" },
        ),
      },
    ];

    if (istNichtAlleinerziehend) {
      schritte.push({
        label: "Angaben",
        placeholder: "Person 2",
        personName: () => person2Name,
        matchingPath: generateAbfrageteilPath(
          Route.ElternteilZweiAllgemeineAngaben,
        ),
      });
    }

    if (zeigePerson2Finanzielle) {
      schritte.push({
        label: "Finanzielle Situation",
        placeholder: "Person 2",
        personName: () => person2Name,
        matchingPath: generatePath(
          generateAbfrageteilPath("/elternteil/:elternteilIndex/finanzielles/"),
          { elternteilIndex: "1" },
        ),
        navigatePath: generatePath(
          generateAbfrageteilPath(Route.ElternteilTaetigkeitenAbfrage),
          { elternteilIndex: "1" },
        ),
      });
    }

    schritte.push(
      { label: "Planungshilfen", matchingPath: "/beispiele" },
      { label: "Planung und Berechnung", matchingPath: "/rechner-planer" },
      {
        label: "Übernahme Planung in Antrag",
        matchingPath: "/datenuebernahme-antrag",
      },
    );

    return schritte;
  }, [
    person1Name,
    person2Name,
    istNichtAlleinerziehend,
    zeigePerson2Finanzielle,
  ]);

  const navigationItems: NavigationItem[] = useMemo(() => {
    return erstelleNavigationsItems(navigationSteps, pathname);
  }, [navigationSteps, pathname]);

  const currentStepIndex = navigationItems.findLastIndex((item) => {
    return pathname.startsWith(item.matchingPath);
  });
  const currentItem = navigationItems[currentStepIndex];
  const currentLabel = currentItem ? displayLabel(currentItem) : "";

  const toggleButtonIdentifier = useId();
  const toggleButtonAriaLabel = `Aktueller Schritt: ${currentLabel}`;

  const twClasses = {
    navbar: "m-0 list-none p-0 max-[1169px]:mb-10",
    navbarActivatorLarge: "hidden text-nowrap px-24 py-16",
    navbarActivatorSmall:
      "max-[1169px]:text-16 max-[1169px]:flex max-[1169px]:w-full max-[1169px]:items-center max-[1169px]:justify-between max-[1169px]:border-none max-[1169px]:bg-primary-light max-[1169px]:text-black",

    menuBase: "m-0 list-none p-0",
    menuClosed: "max-[1169px]:invisible max-[1169px]:absolute",
    menuOpen:
      "transition-height visible absolute left-0 top-56 z-[1] min-h-[25rem] w-full border-0 border-b-2 border-solid border-white bg-primary-light px-24 py-16 text-16 opacity-100 transition-opacity duration-500",

    stepBase: "relative flex items-center",
    stepDivider:
      "mb-24 after:absolute after:-bottom-24 after:left-16 after:min-h-24 after:min-w-1 after:bg-grey-dark after:content-['']",
    stepCurrent:
      "before:border-2 before:border-primary before:bg-primary-light max-[1169px]:before:bg-white",
    stepDone: "before:border-primary before:bg-primary before:text-white",
    stepCircle:
      "before:content-['']  before:mr-16 before:inline-flex before:size-32 before:items-center before:justify-center before:rounded-full before:border before:border-solid before:border-grey-dark",

    stepHeading:
      "appearance-none border-none bg-transparent text-16 text-black",
  };

  function navigiereZuAbschnitt(item: NavigationItem) {
    posthog.capture("navigationspunkt_wurde_geklickt", {
      abschnitt: analyticsLabel(item),
    });

    return navigate(item.navigatePath ?? item.matchingPath);
  }

  return (
    <nav
      ref={navigationElement}
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
        <span>{currentLabel}</span>

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
          const hasFollowing = index !== navigationItems.length - 1;

          return (
            <li
              key={item.matchingPath + index}
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
                onClick={() => navigiereZuAbschnitt(item)}
                aria-current={isCurrent ? "step" : undefined}
                disabled={isDisabled}
              >
                {displayLabel(item)}
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

  const testSteps: NavigationStep[] = [
    { label: "Schritt 1", matchingPath: "/step-1" },
    { label: "Schritt 2", matchingPath: "/step-2" },
    { label: "Schritt 3", matchingPath: "/step-3" },
  ];

  describe("erstelleNavigationsItems", () => {
    it("returns all NavigationItems as not navigatable when on the first step", () => {
      const result = erstelleNavigationsItems(testSteps, "/step-1");

      expect(result.map((item) => item.navigatable)).toEqual([
        false,
        false,
        false,
      ]);
    });

    it("returns steps before current as navigatable and current and following as not navigatable", () => {
      const result = erstelleNavigationsItems(testSteps, "/step-2");

      expect(result.map((item) => item.navigatable)).toEqual([
        true,
        false,
        false,
      ]);
    });
  });
}
