import { useState } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import nsp from "@/globals/js/namespace";
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

  const stepNumber = () => {
    switch (currentStep.route) {
      case "/nachwuchs":
        return "2/7";
      case "/erwerbstaetigkeit":
        return "3/7";
      case "/einkommen":
        return "4/7";
      case "/elterngeldvarianten":
        return "5/7";
      case "/rechner-planer":
        return "6/7";
      case "/zusammenfassung-und-daten":
        return "7/7";
      default:
        return "1/7";
    }
  };

  const buttonLabel = (
    <>
      <strong>{stepNumber()}</strong>
      {currentStep.text}
    </>
  );

  return (
    <div className={classNames(nsp("sidebar"))}>
      <Button
        className={nsp("sidebar__collapse-btn")}
        onClick={() => setIsOpen(!isOpen)}
        label={buttonLabel}
        iconAfter={isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      />

      <ol
        className={classNames(
          nsp("sidebar-list"),
          isOpen && nsp("sidebar-list--open"),
        )}
      >
        {Object.values(formSteps).map((step, index) => (
          <li
            key={index}
            className={classNames(
              nsp("sidebar-list__step"),
              index < currentStepIndex && nsp("sidebar-list__step--done"),
              step === currentStep && nsp("sidebar-list__step--current"),
            )}
          >
            <Link to={step.route}>{step.text}</Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
