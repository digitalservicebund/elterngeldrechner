import { ReactNode } from "react";
import OpenIcon from "@digitalservicebund/icons/Add";
import CloseIcon from "@digitalservicebund/icons/Remove";
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
    <details className="group border-0 border-b-2 border-solid border-black first:border-t-2">
      <summary className="flex items-center justify-between px-24 py-16">
        <div className="flex flex-wrap items-center gap-x-20 gap-y-8">
          <span aria-hidden>
            <ElterngeldvarianteBadge variante={variante} className="min-w-96" />
          </span>
          <h4 className="text-base">{summaryTitle}</h4>
        </div>

        <OpenIcon className="min-h-24 min-w-24 group-open:hidden" />
        <CloseIcon className="hidden min-h-24 min-w-24 group-open:block" />
      </summary>

      <div className="p-24 pt-4">{children}</div>
    </details>
  );
}
