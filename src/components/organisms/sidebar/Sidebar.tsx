import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import classNames from "classnames";
import { useCallback, useId, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FormStep, formSteps } from "@/components/pages/formSteps";
import { useOnFocusMovedOut } from "@/hooks/useOnFocusMovedOut";

interface Props {
  readonly currentStep: FormStep;
}

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
  const toggleButtonAriaLabel = `Schritt ${currentStepNumber} von ${totalStepCount}: ${currentStep.text}`;

  const navigate = useNavigate();

  return (
    <nav
      ref={navigationElement}
      className="egr-sidebar"
      aria-label="Fortschritt"
    >
      <button
        id={toggleButtonIdentifier}
        className="egr-sidebar__collapse-btn text-nowrap px-24 py-16"
        type="button"
        onClick={toggleMenu}
        aria-label={toggleButtonAriaLabel}
        aria-expanded={isOpen}
      >
        <span>
          <strong>
            {currentStepNumber}/{totalStepCount}
          </strong>
          {currentStep.text}
        </span>

        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </button>

      <ol
        className={classNames(
          "egr-sidebar-list",
          isOpen && "egr-sidebar-list--open",
        )}
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
              className={classNames(
                "egr-sidebar-list__step",
                index < currentStepIndex && "egr-sidebar-list__step--done",
                step === currentStep && "egr-sidebar-list__step--current",
              )}
            >
              <button
                className="appearance-none border-none bg-transparent text-16 text-black"
                type="button"
                onClick={navigateToStep}
                aria-current={ariaCurrent}
                disabled={!isNavigatable}
              >
                {step.text}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
