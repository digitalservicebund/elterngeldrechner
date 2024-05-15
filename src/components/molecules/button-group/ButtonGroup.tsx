import { MouseEvent, VFC } from "react";
import { Button } from "@/components/atoms";
import nsp from "@/globals/js/namespace";
import classNames from "classnames";

interface Props {
  onClickBackButton?: (event: MouseEvent) => void;
  onClickResetForm?: (event: MouseEvent) => void;
  isStepOne?: boolean;
}

export const ButtonGroup: VFC<Props> = ({
  onClickBackButton,
  onClickResetForm,
  isStepOne = false,
}) => {
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
