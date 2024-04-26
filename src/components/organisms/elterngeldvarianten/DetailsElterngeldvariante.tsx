import classNames from "classnames";
import { ReactNode, useState } from "react";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { PayoutInformation } from "./PayoutInformation";
import { PayoutAmounts } from "./types";

type Props = {
  summaryTitle: string;
  summaryClassName?: string;
  monthsAvailable: number;
  parentNames: { ET1: string; ET2: string };
  payoutAmounts: PayoutAmounts;
  isSingleApplicant: boolean;
  children: ReactNode;
};

export function DetailsElterngeldvariante({
  summaryTitle,
  summaryClassName,
  monthsAvailable,
  parentNames,
  payoutAmounts,
  isSingleApplicant,
  children,
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const ExpandStateIcon = isOpen ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <details
      className="overflow-hidden rounded bg-grey"
      onToggle={toggleIsOpen}
    >
      <summary
        className={classNames(
          "flex justify-between list-none items-center cursor-pointer px-24 py-16",
          summaryClassName,
        )}
      >
        <div className="flex flex-wrap gap-y-10">
          <div className="flex basis-full flex-wrap items-center gap-x-8">
            <strong className="text-24">{summaryTitle}</strong>(
            {monthsAvailable} Monate verfügbar)
          </div>

          <div className="flex flex-wrap gap-x-24 gap-y-8">
            <PayoutInformation
              parentName={isSingleApplicant ? undefined : parentNames.ET1}
              amount={payoutAmounts.ET1}
            />

            {!isSingleApplicant && (
              <PayoutInformation
                parentName={parentNames.ET2}
                amount={payoutAmounts.ET2}
              />
            )}
          </div>
        </div>

        <ExpandStateIcon className="min-h-40 min-w-40" />
      </summary>

      <div className="bg-off-white px-48 py-24">{children}</div>
    </details>
  );
}
