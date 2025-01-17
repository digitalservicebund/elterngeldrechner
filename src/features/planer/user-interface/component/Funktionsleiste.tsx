import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import classNames from "classnames";
import { ReactNode, useId } from "react";
import { Button } from "@/components/atoms";
import { PrintButton } from "@/components/molecules";

type Props = {
  readonly planungWiederholen: () => void;
  readonly isDownloadDisabled?: boolean;
  readonly className?: string;
};

export function Funktionsleiste({
  planungWiederholen,
  isDownloadDisabled,
  className,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section
      className={classNames("flex flex-col gap-32 print:hidden", className)}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="sr-only">
        Funktionsleiste
      </h4>

      <div>
        <Button
          buttonStyle="link"
          label="Planung wiederholen"
          iconBefore={<RestartAltIcon />}
          onClick={planungWiederholen}
        />
      </div>

      <PrintButton disabled={isDownloadDisabled} />
    </section>
  );
}
