import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { FormStep, formSteps } from "@/components/pages/formSteps";
import { Button } from "@/components/atoms";
import { useOnFocusMovedOut } from "@/hooks/useOnFocusMovedOut";

interface Props {
  readonly currentStep: FormStep;
}

export function Sidebar({ currentStep }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const navigationElement = useRef<HTMLElement>(null);
  const closeMenu = useCallback(() => setIsOpen(false), []);
  useOnFocusMovedOut(navigationElement, closeMenu);

  const currentStepIndex = Object.values(formSteps).findIndex(
    (step) => step === currentStep,
  );

  const stepsTotal = Object.entries(formSteps).length;
  const stepLabel = `${currentStepIndex + 1}/${stepsTotal}`;

  const buttonLabel = (
    <>
      <strong>{stepLabel}</strong>
      {currentStep.text}
    </>
  );

  return (
    <nav
      ref={navigationElement}
      className="egr-sidebar"
      aria-label="Fortschritt"
    >
      <Button
        className="egr-sidebar__collapse-btn text-nowrap"
        onClick={() => setIsOpen(!isOpen)}
        label={buttonLabel}
        iconAfter={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        aria-expanded={isOpen}
        aria-haspopup
      />

      <ol
        className={classNames(
          "egr-sidebar-list",
          isOpen && "egr-sidebar-list--open",
        )}
      >
        {Object.values(formSteps).map((step, index) => {
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
              {isNavigatable ? (
                <Link to={step.route} aria-current={ariaCurrent}>
                  {step.text}
                </Link>
              ) : (
                <span aria-current={ariaCurrent}>{step.text}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
