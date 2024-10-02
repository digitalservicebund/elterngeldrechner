import classNames from "classnames";
import { ReactNode } from "react";
import {
  KeinElterngeld,
  Variante,
  type Auswahloption,
  type Elterngeldbezug,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props = {
  readonly option: Auswahloption;
  readonly elterngeldbezug: Elterngeldbezug;
  readonly isChecked?: boolean;
  readonly isDisabled?: boolean;
  readonly htmlFor: string;
};

export function AuswahloptionLabel({
  option,
  elterngeldbezug,
  isChecked,
  isDisabled,
  htmlFor,
}: Props): ReactNode {
  const { label, className, checkedClassName } = RENDER_PROPERTIES[option];

  return (
    <label
      className={classNames(
        "flex min-h-56 items-center justify-center rounded bg-Basis p-8 text-center",
        { "cursor-default !bg-grey !text-black": isDisabled },
        { "hover:underline": !isDisabled },
        { [checkedClassName]: isChecked && !isDisabled },
        className,
      )}
      style={{ fontSize: "min(1em, 4.8cqi)" }}
      htmlFor={htmlFor}
    >
      <span aria-hidden>
        <span className="font-bold">{label}</span>
        {!!elterngeldbezug && <>&nbsp;{formatAsCurrency(elterngeldbezug)}</>}
      </span>
    </label>
  );
}

const SHARED_CHECKED_CLASS_NAME = "ring-4";
const RENDER_PROPERTIES: Record<Auswahloption, RenderProperties> = {
  [Variante.Basis]: {
    label: "Basis",
    className: "bg-Basis text-white",
    checkedClassName: classNames("ring-Plus", SHARED_CHECKED_CLASS_NAME),
  },
  [Variante.Plus]: {
    label: "Plus",
    className: "bg-Plus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  [Variante.Bonus]: {
    label: "Bonus",
    className: "bg-Bonus text-black",
    checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
  },
  [KeinElterngeld]: {
    label: "kein Elterngeld",
    className: "bg-white text-black border-grey border-2 border-solid",
    checkedClassName: classNames(
      "ring-Basis border-none",
      SHARED_CHECKED_CLASS_NAME,
    ),
  },
};

type RenderProperties = {
  label: string;
  className: string;
  checkedClassName: string;
};
