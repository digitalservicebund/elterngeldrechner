import { VFC } from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import nsp from "../../../globals/js/namespace";
import classNames from "classnames";
import { FormStep, formSteps } from "../../../utils/formSteps";
import { Button } from "../../atoms";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";

interface Props {
  currentStep: FormStep;
}

export const Sidebar: VFC<Props> = ({ currentStep }) => {
  const [isOpen, setIsOpen] = useState(false);

  const currentStepIndex = Object.values(formSteps).findIndex(
    (step) => step === currentStep,
  );

  const stepNumber = () => {
    switch (currentStep.route) {
      case "/nachwuchs":
        return "2/6";
      case "/erwerbstaetigkeit":
        return "3/6";
      case "/einkommen":
        return "4/6";
      case "/rechner-planer":
        return "5/6";
      case "/zusammenfassung-und-daten":
        return "6/6";
      default:
        return "1/6";
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
};
