import { FC, useEffect } from "react";
import { AriaMessage } from "../../atoms";
import { FormStep } from "../../../utils/formSteps";
import { Sidebar } from "../sidebar";
import nsp from "../../../globals/js/namespace";
import { FootNote } from "../../molecules";
import classNames from "classnames";

interface PageProps {
  step: FormStep;
  children: React.ReactNode;
}

export const Page: FC<PageProps> = ({ step, children }) => {
  // scroll to top on page navigation
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className={nsp("page")}>
      <div className={nsp("page__sidebar")}>
        <Sidebar currentStep={step} />
      </div>
      <AriaMessage>{step.text}</AriaMessage>
      <div className={classNames(nsp("page__content"), "relative")}>
        <FootNote id={nsp("foot-note-for-required-fields")}>
          Die mit einem Stern (*) gekennzeichneten Felder sind Pflichtfelder und
          müssen ausgefüllt sein.
        </FootNote>
        {children}
      </div>
    </div>
  );
};
