import type { ReactNode } from "react";
import RestartAltIcon from "@digitalservicebund/icons/RestartAlt";
import { Button } from "@/components/atoms";

type Props = {
  readonly planungWiederholen: () => void;
  readonly className?: string;
};

export function Funktionsleiste({
  planungWiederholen,
  className,
}: Props): ReactNode {
  return (
    <div className={className}>
      <Button
        buttonStyle="link"
        label="Planung wiederholen"
        iconBefore={<RestartAltIcon />}
        onClick={planungWiederholen}
      />
    </div>
  );
}
