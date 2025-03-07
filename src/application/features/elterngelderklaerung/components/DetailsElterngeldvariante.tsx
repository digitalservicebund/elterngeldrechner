import OpenIcon from "@digitalservicebund/icons/Add";
import CloseIcon from "@digitalservicebund/icons/Remove";
import classNames from "classnames";
import { ReactNode } from "react";

type Props = {
  readonly summaryTitle: string;
  readonly variante: "Basis" | "Plus" | "Bonus";
  readonly children: ReactNode;
};

export function DetailsElterngeldvariante({
  summaryTitle,
  variante,
  children,
}: Props): ReactNode {
  const variantenClassNames = CLASS_NAME_FOR_VARIANTE[variante];

  return (
    <details className="group border-0 border-b-2 border-solid border-black first:border-t-2">
      <summary className="flex list-none items-center justify-between px-24 py-16">
        <div className="flex flex-wrap items-center gap-x-20 gap-y-8">
          <span
            className={classNames(
              "flex min-w-96 items-center justify-center rounded px-8 pb-10 pt-6 text-center font-bold leading-[1.444]",
              variantenClassNames,
            )}
            aria-hidden
          >
            {variante}
          </span>

          <h3 className="text-base">{summaryTitle}</h3>
        </div>

        <OpenIcon className="min-h-24 min-w-24 group-open:hidden" />
        <CloseIcon className="hidden min-h-24 min-w-24 group-open:block" />
      </summary>

      <div className="p-24 pt-4">{children}</div>
    </details>
  );
}

type Variante = "Basis" | "Plus" | "Bonus";

const CLASS_NAME_FOR_VARIANTE: Record<Variante, string> = {
  Basis: "bg-Basis text-white",
  Plus: "bg-Plus text-black",
  Bonus: "bg-Bonus text-black",
};
