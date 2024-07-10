import classNames from "classnames";
import { ReactNode } from "react";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";

type Props = {
  readonly summaryTitle: string;
  readonly summaryClassName?: string;
  readonly children: ReactNode;
};

export function DetailsElterngeldvariante({
  summaryTitle,
  summaryClassName,
  children,
}: Props): ReactNode {
  return (
    <details className="group overflow-hidden rounded bg-grey">
      <summary
        className={classNames(
          "flex justify-between list-none items-center cursor-pointer px-24 py-16",
          summaryClassName,
        )}
      >
        <div className="flex flex-wrap gap-y-10">
          <h4 className="flex basis-full flex-wrap items-center gap-x-8 text-24">
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
