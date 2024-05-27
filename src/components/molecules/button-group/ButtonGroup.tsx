import { MouseEvent } from "react";
import classNames from "classnames";
import { Button } from "@/components/atoms";
import nsp from "@/globals/js/namespace";

interface Props {
  readonly onClickBackButton?: (event: MouseEvent) => void;
  readonly onClickResetForm?: (event: MouseEvent) => void;
  readonly isStepOne?: boolean;
}

export function ButtonGroup({
  onClickBackButton,
  onClickResetForm,
  isStepOne = false,
}: Props) {
  const secondButtonAttributes = onClickResetForm
    ? { onClick: onClickResetForm, label: "Neu starten" }
    : { isSubmitButton: true, label: "Weiter" };

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
}
