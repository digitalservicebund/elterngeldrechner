import { ReactNode } from "react";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { ElterngeldType } from "@/monatsplaner";
import { ElterngeldvarianteBadge } from "@/components/atoms/ElterngeldVarianteBadge";

type Props = {
  readonly summaryTitle: string;
  readonly variante: ElterngeldType;
  readonly children: ReactNode;
};

export function DetailsElterngeldvariante({
  summaryTitle,
  variante,
  children,
}: Props): ReactNode {
  return (
    <details className="group overflow-hidden rounded bg-grey">
      <summary className="flex justify-between list-none items-center cursor-pointer px-24 py-16">
        <div className="flex flex-wrap gap-10">
          <ElterngeldvarianteBadge variante={variante} />
          <h4 className="flex flex-wrap items-center gap-x-8 text-24">
            {summaryTitle}
          </h4>
        </div>

        <ExpandMoreIcon className="min-h-40 min-w-40 group-open:hidden" />
        <ExpandLessIcon className="hidden min-h-40 min-w-40 group-open:block" />
      </summary>

      <div className="bg-off-white p-32 pb-56">{children}</div>
    </details>
  );
}
