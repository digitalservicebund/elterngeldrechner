import classNames from "classnames";
import { ReactNode, useState } from "react";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";

interface Props {
  summaryTitle: string;
  summaryClassName?: string;
  monthsAvailable: number;
  children: ReactNode;
}

export function DetailsElterngeldvariante({
  summaryTitle,
  summaryClassName,
  monthsAvailable,
  children,
}: Props): ReactNode {
  const [isOpen, setIsOpen] = useState(false);
  const toggleIsOpen = () => setIsOpen(!isOpen);
  const ExpandStateIcon = isOpen ? ExpandLessIcon : ExpandMoreIcon;

  return (
    <details
      className="overflow-hidden rounded bg-grey"
      name="Elterngeldvarianten"
      onToggle={toggleIsOpen}
    >
      <summary
        className={classNames(
          "flex justify-between list-none items-center cursor-pointer px-24 py-16",
          summaryClassName,
        )}
      >
        <div className="flex basis-full flex-wrap items-center gap-x-8">
          <strong className="text-24">{summaryTitle}</strong>({monthsAvailable}{" "}
          Monate verfügbar)
        </div>

        <ExpandStateIcon className="!size-40" />
      </summary>

      <div className="bg-grey p-24">{children}</div>
    </details>
  );
}
