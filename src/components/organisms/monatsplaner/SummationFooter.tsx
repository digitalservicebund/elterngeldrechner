import { ReactNode, useId } from "react";
import { ParentSummation } from "./ParentSummation";
import classNames from "classnames";
import { SummationDataForParent } from "./types";

type Props = {
  className?: string;
  data: SummationDataForParent[];
};

export function SummationFooter({ data, className }: Props): ReactNode {
  const labelIdentifier = useId();
  const hideParentName = data.length === 1;

  return (
    <footer
      aria-labelledby={labelIdentifier}
      className={classNames(
        className,
        "flex flex-wrap justify-evenly gap-24 text-center",
      )}
    >
      <span id={labelIdentifier} className="basis-full">
        Gesamtsumme<span aria-hidden>:</span>
      </span>

      {data.map((entry) => (
        <div key={entry.name} className="flex w-240 flex-col items-center">
          <ParentSummation
            {...entry}
            name={hideParentName ? undefined : entry.name}
          />
        </div>
      ))}
    </footer>
  );
}
