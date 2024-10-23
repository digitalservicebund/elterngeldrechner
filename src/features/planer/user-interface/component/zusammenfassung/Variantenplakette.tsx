import type { ReactNode } from "react";
import classNames from "classnames";
import { Variante } from "@/features/planer/user-interface/service";

type Props = {
  readonly variante: Variante;
};

export function Variantenplakette({ variante }: Props): ReactNode {
  const { shortName, className } = RENDER_PROPERTIES[variante];

  return (
    <span
      className={classNames(
        "line-height flex min-w-[7ch] justify-center rounded p-8",
        className,
      )}
    >
      {shortName}
    </span>
  );
}

const RENDER_PROPERTIES: Record<Variante, RenderProperties> = {
  [Variante.Basis]: {
    shortName: "Basis",
    className: "bg-Basis text-white",
  },
  [Variante.Plus]: {
    shortName: "Plus",
    className: "bg-Plus text-black",
  },
  [Variante.Bonus]: {
    shortName: "Bonus",
    className: "bg-Bonus text-black",
  },
};

type RenderProperties = {
  shortName: string;
  className: string;
};
