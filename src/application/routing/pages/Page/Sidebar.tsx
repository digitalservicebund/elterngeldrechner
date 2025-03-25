import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useCallback, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOnFocusMovedOut } from "@/application/hooks/useOnFocusMovedOut";
import { FormStep, formSteps } from "@/application/routing/formSteps";

type Props = {
  readonly currentStep: FormStep;
};

export function Sidebar({ currentStep }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = useCallback(() => setIsOpen((isOpen) => !isOpen), []);

  const navigationElement = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOnFocusMovedOut(navigationElement, closeMenu);

  const currentStepIndex = Object.values(formSteps).findIndex(
    (step) => step === currentStep,
  );
  const currentStepNumber = currentStepIndex + 1;
  const totalStepCount = Object.entries(formSteps).length;

  const toggleButtonIdentifier = useId();
  const toggleButtonAriaLabel = `Schritt ${currentStepNumber} von ${totalStepCount}: ${currentStep.heading}`;

  const navigate = useNavigate();

  const twClasses = {
    navbar: "m-0 list-none p-0 max-[1169px]:mb-40",
    navbarActivatorLarge: "hidden text-nowrap px-24 py-16",
    navbarActivatorSmall:
      "max-[1169px]:flex max-[1169px]:w-full max-[1169px]:items-center max-[1169px]:justify-between max-[1169px]:border-none max-[1169px]:bg-primary-light max-[1169px]:text-black",

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
          {currentStep.heading}
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
        {Object.values(formSteps).map((step, index) => {
          const navigateToStep = () => navigate(step.route);
          const isCurrentStep = index === currentStepIndex;
          const ariaCurrent = isCurrentStep ? "step" : false;
          const isNavigatable = index <= currentStepIndex;

          return (
            <li
              key={step.route}
              style={{ counterIncrement: "item" }}
              className={classNames({
                [twClasses.stepBase]: true,
                [twClasses.stepCircle]: true,
                [twClasses.stepCurrent]: step === currentStep,
                [twClasses.stepDone]: index < currentStepIndex,
                [twClasses.stepDivider]: index < totalStepCount - 1,
              })}
            >
              <button
                className={classNames(twClasses.stepHeading, {
                  "cursor-default": !isNavigatable,
                })}
                type="button"
                onClick={navigateToStep}
                aria-current={ariaCurrent}
                disabled={!isNavigatable}
              >
                {("shortName" in step && step.shortName) || step.heading}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
