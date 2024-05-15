import { MouseEvent } from "react";
import classNames from "classnames";
import { Button } from "@/components/atoms";
import nsp from "@/globals/js/namespace";

interface Props {
  onClickBackButton?: (event: MouseEvent) => void;
  onClickResetForm?: (event: MouseEvent) => void;
  isStepOne?: boolean;
}

export const ButtonGroup = ({
  onClickBackButton,
  onClickResetForm,
  isStepOne = false,
}: Props) => {
  const secondButtonAttributes = onClickResetForm
    ? { onClick: onClickResetForm, label: "Neu starten" }
    : { type: "submit" as const, label: "Weiter" };

  return (
    <section
      className={classNames(
        nsp("button-group"),
        isStepOne && nsp("button-group--step-one"),
      )}
    >
      {!isStepOne && (
        <Button
          onClick={onClickBackButton}
          label="Zurück"
          buttonStyle="secondary"
        />
      )}

      <Button {...secondButtonAttributes} />
    </section>
  );
};
