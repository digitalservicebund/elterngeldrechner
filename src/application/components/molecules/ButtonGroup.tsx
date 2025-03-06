import classNames from "classnames";
import { MouseEvent, ReactNode } from "react";
import { Button } from "@/application/components/atoms";

interface Props {
  readonly onClickBackButton?: (event: MouseEvent) => void;
  readonly children?: ReactNode;
}

export function ButtonGroup({ onClickBackButton, children }: Props) {
  return (
    <section
      className={classNames(
        "mt-56 flex items-end justify-between gap-16 print:hidden",
        !onClickBackButton && "!justify-end",
      )}
    >
      {onClickBackButton ? (
        <Button
          onClick={onClickBackButton}
          label="Zurück"
          buttonStyle="secondary"
        />
      ) : (
        ""
      )}

      {children || <Button isSubmitButton label="Weiter" />}
    </section>
  );
}
