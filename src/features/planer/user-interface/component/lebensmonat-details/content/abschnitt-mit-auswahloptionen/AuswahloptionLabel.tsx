import LockIcon from "@digitalservicebund/icons/Lock";
import classNames from "classnames";
import { ReactNode } from "react";
import {
  type Auswahloption,
  type Elterngeldbezug,
  KeinElterngeld,
  Variante,
} from "@/features/planer/domain";
import { Geldbetrag } from "@/features/planer/user-interface/component/Geldbetrag";

type Props = {
  readonly option: Auswahloption;
  readonly istBasisImMutterschutz: boolean; // TODO: How to enforce relation with `option` caller friendly?
  readonly elterngeldbezug: Elterngeldbezug;
  readonly isChecked?: boolean;
  readonly isDisabled?: boolean;
  readonly htmlFor: string;
};

export function AuswahloptionLabel({
  option,
  istBasisImMutterschutz,
  elterngeldbezug,
  isChecked,
  isDisabled,
  htmlFor,
}: Props): ReactNode {
  const { label, className, checkedClassName, icon } = getRenderProperties(
    option,
    istBasisImMutterschutz,
  );

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
        <span className="inline-flex items-center font-bold">
          {!!icon && <>{icon}&nbsp;</>}
          {label}
        </span>

        {!!elterngeldbezug && (
          <>
            &nbsp;
            <Geldbetrag betrag={elterngeldbezug} />
          </>
        )}
      </span>
    </label>
  );
}

function getRenderProperties(
  option: Auswahloption,
  istBasisImMutterschutz: boolean,
): RenderProperties {
  switch (option) {
    case Variante.Basis:
      return {
        label: istBasisImMutterschutz ? "Mutterschutz" : "Basis",
        className: "bg-Basis text-white",
        checkedClassName: classNames("ring-Plus", SHARED_CHECKED_CLASS_NAME),
        icon: istBasisImMutterschutz ? (
          <LockIcon className="text-Plus" />
        ) : undefined,
      };

    case Variante.Plus:
      return {
        label: "Plus",
        className: "bg-Plus text-black",
        checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
      };

    case Variante.Bonus:
      return {
        label: "Bonus",
        className: "bg-Bonus text-black",
        checkedClassName: classNames("ring-Basis", SHARED_CHECKED_CLASS_NAME),
      };

    case KeinElterngeld:
      return {
        label: "kein Elterngeld",
        className: "bg-white text-black border-grey border-2 border-solid",
        checkedClassName: classNames(
          "ring-Basis border-none",
          SHARED_CHECKED_CLASS_NAME,
        ),
      };
  }
}

const SHARED_CHECKED_CLASS_NAME = "ring-4";

type RenderProperties = {
  label: string;
  className: string;
  checkedClassName: string;
  icon?: ReactNode;
};
