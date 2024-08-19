import type { ReactNode } from "react";
import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import SaveAltIcon from "@digitalservicebund/icons/SaveAlt";
import classNames from "classnames";
import { Button } from "@/components/atoms";

type Props = {
  readonly planungWiederholen: () => void;
  readonly downloadePlan: () => void;
  readonly className?: string;
};

export function Funktionsleiste({
  planungWiederholen,
  downloadePlan,
  className,
}: Props): ReactNode {
  return (
    <div className={classNames("flex flex-wrap gap-32", className)}>
      <Button
        buttonStyle="link"
        label="Planung wiederholen"
        iconBefore={<RestartAltIcon />}
        onClick={planungWiederholen}
      />

      <Button
        buttonStyle="link"
        label="Download der Planung"
        iconBefore={<SaveAltIcon />}
        onClick={downloadePlan}
      />
    </div>
  );
}
