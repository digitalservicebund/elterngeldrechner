import classNames from "classnames";
import { ReactNode, useId } from "react";
import { PrintButton } from "@/application/components";

type Props = {
  readonly className?: string;
};

export function Funktionsleiste({ className }: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section
      className={classNames("flex flex-col gap-32 print:hidden", className)}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Funktionsleiste
      </h4>

      <PrintButton />
    </section>
  );
}
