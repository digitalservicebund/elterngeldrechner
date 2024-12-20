import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { FormStep, formSteps } from "@/utils/formSteps";
import { Button } from "@/components/atoms";

interface Props {
  readonly currentStep: FormStep;
}

export function Sidebar({ currentStep }: Props) {
  const [isOpen, setIsOpen] = useState(false);

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
    <nav className="egr-sidebar" aria-label="Fortschritt">
      <Button
        className="egr-sidebar__collapse-btn text-nowrap"
        onClick={() => setIsOpen(!isOpen)}
        label={buttonLabel}
        iconAfter={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
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

          return (
            <li
              key={step.route}
              className={classNames(
                "egr-sidebar-list__step",
                index < currentStepIndex && "egr-sidebar-list__step--done",
                step === currentStep && "egr-sidebar-list__step--current",
              )}
            >
              <Link to={step.route} aria-current={ariaCurrent}>
                {step.text}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
