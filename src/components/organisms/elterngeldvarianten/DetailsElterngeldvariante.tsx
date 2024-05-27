import classNames from "classnames";
import { ReactNode, useState } from "react";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import { PayoutInformation } from "./PayoutInformation";
import { PayoutAmoutForVariant } from "./types";

type Props = {
  readonly summaryTitle: string;
  readonly summaryClassName?: string;
  readonly monthsAvailable: number;
  readonly payoutAmounts: PayoutAmoutForVariant[];
  readonly children: ReactNode;
};

export function DetailsElterngeldvariante({
  summaryTitle,
  summaryClassName,
  monthsAvailable,
  payoutAmounts,
  children,
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const ExpandStateIcon = isOpen ? ExpandLessIcon : ExpandMoreIcon;

  const isSingleParent = payoutAmounts.length === 1;

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
            {payoutAmounts.map(({ name, amount }) => (
              <PayoutInformation
                key={name}
                name={isSingleParent ? undefined : name}
                amount={amount}
              />
            ))}
          </div>
        </div>

        <ExpandStateIcon className="min-h-40 min-w-40" />
      </summary>

      <div className="bg-off-white px-40 py-24">{children}</div>
    </details>
  );
}
