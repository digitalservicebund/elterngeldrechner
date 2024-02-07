import { FC } from "react";
import { AriaMessage } from "../../atoms";
import { FormStep } from "../../../utils/formSteps";
import { Sidebar } from "../sidebar";
import nsp from "../../../globals/js/namespace";
import { FootNote } from "../../molecules";

interface PageProps {
  step: FormStep;
}

export const Page: FC<PageProps> = ({ step, children }) => {
  return (
    <div className={nsp("page")}>
      <div className={nsp("page__sidebar")}>
        <Sidebar currentStep={step} />
      </div>
      <AriaMessage>{step.text}</AriaMessage>
      <div className={nsp("page__content")}>
        <FootNote id={nsp("foot-note-for-required-fields")}>
          Die mit einem Stern (*) gekennzeichneten Felder sind Pflichtfelder und
          müssen ausgefüllt sein.
        </FootNote>
        {children}
      </div>
    </div>
  );
};
