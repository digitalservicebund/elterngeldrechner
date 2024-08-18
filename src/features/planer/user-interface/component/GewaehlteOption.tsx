import type { ReactNode } from "react";
import classNames from "classnames";
import AddIcon from "@digitalservicebund/icons/Add";
import LockIcon from "@digitalservicebund/icons/Lock";
import {
  KeinElterngeld,
  Variante,
  type Auswahloption,
} from "@/features/planer/user-interface/service";

type Props = {
  readonly imMutterschutz?: boolean;
  readonly option?: Auswahloption;
  readonly className?: string;
};

export function GewaehlteOption({
  imMutterschutz,
  option,
  className,
}: Props): ReactNode {
  const label = getLabel(imMutterschutz, option);
  const conditionalClassName = getClassName(option);
  const icon = getIcon(option !== undefined, imMutterschutz);

  return (
    <span
      className={classNames(
        "p-8 min-h-56 rounded font-bold flex text-center items-center justify-center gap-4",
        className,
        conditionalClassName,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

function getLabel(imMutterschutz?: boolean, option?: Auswahloption): string {
  if (imMutterschutz) {
    return "Mutterschutz";
  } else {
    switch (option) {
      case Variante.Basis:
        return "Basis";

      case Variante.Plus:
        return "Plus";

      case Variante.Bonus:
        return "Bonus";

      case KeinElterngeld:
        return "kein Elterngeld";

      case undefined:
        return "hinzufügen";
    }
  }
}

function getClassName(option?: Auswahloption): string {
  switch (option) {
    case Variante.Basis:
      return "bg-Basis text-white";

    case Variante.Plus:
      return "bg-Plus text-black";

    case Variante.Bonus:
      return "bg-Bonus text-black";

    case KeinElterngeld:
      return "bg-white text-black border-grey border-2 border-solid";

    case undefined:
      return "bg-off-white text-black border-grey border-2 border-solid";
  }
}

function getIcon(
  hasAuswahl: boolean,
  imMutterschutz?: boolean,
): ReactNode | undefined {
  if (imMutterschutz) {
    return <LockIcon className="text-Plus" />;
  } else if (!hasAuswahl) {
    return <AddIcon />;
  }
}
