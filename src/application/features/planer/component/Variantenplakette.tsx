import classNames from "classnames";
import type { ReactNode } from "react";
import { Variante } from "@/monatsplaner";

type Props = {
  readonly variante: Variante | "Kein Elterngeld";
};

export function Variantenplakette({ variante }: Props): ReactNode {
  const { shortName, className } = RENDER_PROPERTIES[variante];

  return (
    <span
      className={classNames(
        "flex min-w-[7ch] justify-center rounded p-8 font-bold",
        className,
      )}
    >
      {shortName}
    </span>
  );
}

const RENDER_PROPERTIES: Record<
  Variante | "Kein Elterngeld",
  RenderProperties
> = {
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
  "Kein Elterngeld": {
    shortName: "Kein Elterngeld",
    className: "bg-white text-black",
  },
};

type RenderProperties = {
  shortName: string;
  className: string;
};
