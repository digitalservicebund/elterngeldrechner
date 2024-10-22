import { ReactNode, useId } from "react";
import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import classNames from "classnames";
import { Button } from "@/components/atoms";

type Props = {
  readonly planungWiederholen: () => void;
  readonly downloadePlan: () => void;
  readonly isDownloadDisabled?: boolean;
  readonly className?: string;
};

export function Funktionsleiste({
  planungWiederholen,
  downloadePlan,
  isDownloadDisabled,
  className,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section
      className={classNames("flex flex-wrap gap-32", className)}
      aria-labelledby={headingIdentifier}
    >
      <h3 id={headingIdentifier} className="sr-only">
        Funktionsleiste
      </h3>

      <Button
        buttonStyle="link"
        label="Planung wiederholen"
        iconBefore={<RestartAltIcon />}
        onClick={planungWiederholen}
      />

      <Button
        className={classNames({
          "text-grey-dark hover:cursor-default": isDownloadDisabled,
        })}
        buttonStyle="link"
        label="Download der Planung"
        iconBefore={<SaveAltIcon />}
        onClick={downloadePlan}
        disabled={isDownloadDisabled}
      />
    </section>
  );
}
