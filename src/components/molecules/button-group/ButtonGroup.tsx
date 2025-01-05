import classNames from "classnames";
import { MouseEvent } from "react";
import { Button } from "@/components/atoms";

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
        "egr-button-group",
        isStepOne && "egr-button-group--step-one",
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
