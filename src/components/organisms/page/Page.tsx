import { ReactNode, useEffect } from "react";
import classNames from "classnames";
import { AriaMessage } from "@/components/atoms";
import { FormStep } from "@/utils/formSteps";
import { Sidebar } from "@/components/organisms/sidebar";
import nsp from "@/globals/js/namespace";
import { FootNote } from "@/components/molecules";

interface PageProps {
  readonly step: FormStep;
  readonly children: ReactNode;
}

export function Page({ step, children }: PageProps) {
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
      <div
        className={classNames(nsp("page__content"), "relative")}
        id={step.text}
      >
        <FootNote id={nsp("foot-note-for-required-fields")}>
          Die mit einem Stern (*) gekennzeichneten Felder sind Pflichtfelder und
          müssen ausgefüllt sein.
        </FootNote>
        {children}
      </div>
    </div>
  );
}
