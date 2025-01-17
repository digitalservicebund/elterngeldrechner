import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import classNames from "classnames";
import { ReactNode, useCallback } from "react";
import { Button } from "@/components/atoms";

type Props = {
  readonly disabled?: boolean;
};

export function PrintButton({ disabled }: Props): ReactNode {
  const print = useCallback(() => {
    if (!disabled) {
      window.print();
    }
  }, [disabled]);

  return (
    <div className="print:hidden">
      <Button
        className={classNames({
          "text-grey-dark hover:cursor-default": disabled,
        })}
        buttonStyle="link"
        label="Drucken der Planung"
        iconBefore={<SaveAltIcon />}
        onClick={print}
        disabled={disabled}
      />

      <p>
        Um Ihre Planung zu speichern, wählen Sie in der Druckvorschau „als PDF
        speichern“ aus.
      </p>
    </div>
  );
}
