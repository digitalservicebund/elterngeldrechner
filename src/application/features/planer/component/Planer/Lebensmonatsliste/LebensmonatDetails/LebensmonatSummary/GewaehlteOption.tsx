import AddIcon from "@digitalservicebund/icons/AddCircleOutline";
import LockIcon from "@digitalservicebund/icons/Lock";
import classNames from "classnames";
import type { CSSProperties, ReactNode } from "react";
import { type Auswahloption, KeinElterngeld, Variante } from "@/monatsplaner";

type Props = {
  readonly imMutterschutz?: boolean;
  readonly bruttoeinkommenIsMissing: boolean;
  readonly option?: Auswahloption;
  readonly className?: string;
  readonly style?: CSSProperties;
  readonly ariaHidden?: boolean;
};

export function GewaehlteOption({
  imMutterschutz,
  bruttoeinkommenIsMissing,
  option,
  className,
  style,
  ariaHidden,
}: Props): ReactNode {
  const label = getLabel(imMutterschutz, option);
  const conditionalClassName = getClassName(option, bruttoeinkommenIsMissing);
  const icon = getIcon(option !== undefined, imMutterschutz);

  /*
   * To improve responsiveness for narrow screens only the icon should be shown
   * if there is one, and if icon plus label do not fit next to each other.
   * Wrapping must be avoided for a unified row layout.
   *
   * As there is no proper way to define with effect with intrinsic CSS styling,
   * this rather cheap approach with a container query is chosen. The CSS unit
   * `ch` for character width is somewhat helpful here (should mean not accurate).
   */
  const canHideLabelWhenTooNarrow = icon !== undefined;
  const labelClassName = classNames({
    "hidden @[12ch]:block": canHideLabelWhenTooNarrow,
  });
  const labelStyle = getLabelStyle(option);

  return (
    <span
      className={classNames(
        "flex min-h-56 items-center justify-center gap-4 rounded p-8 text-center font-bold @container",
        className,
        conditionalClassName,
      )}
      style={style}
      aria-hidden={ariaHidden}
    >
      {icon}
      <span className={classNames("-mt-4", labelClassName)} style={labelStyle}>
        {label}
      </span>
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

function getClassName(
  option: Auswahloption | undefined,
  bruttoeinkommenIsMissing: boolean,
): string {
  switch (option) {
    case Variante.Basis:
      return "bg-Basis text-white";

    case Variante.Plus:
      return "bg-Plus text-black";

    case Variante.Bonus:
      return bruttoeinkommenIsMissing
        ? "bg-Bonus-light text-black relative before:content-[''] before:absolute before:inset-0 before:border-2 before:border-Bonus-dark before:border-dashed before:rounded"
        : "bg-Bonus text-black";

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
  } else return undefined;
}

// Scales the 'kein Elterngeld' text on smaller screens. Normally, small screens
// hide the text and show only the icon, but since this option has no icon, the
// font size is adjusted instead.
function getLabelStyle(option: Auswahloption | undefined): CSSProperties {
  switch (option) {
    case KeinElterngeld:
      return { fontSize: "clamp(0.75rem, 2.4vw, 1.125rem)" };
    default:
      return {};
  }
}
