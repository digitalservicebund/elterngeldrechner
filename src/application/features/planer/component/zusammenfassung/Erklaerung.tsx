import CloseIcon from "@digitalservicebund/icons/Close";
import { ReactNode } from "react";
import { Button } from "@/application/components";

type Props = {
  readonly onClose: () => void;
};

export function Erklaerung({ onClose }: Props): ReactNode {
  const closeButton = (
    <Button
      onClick={onClose}
      iconBefore={<CloseIcon />}
      label="Informationen schließen"
    />
  );

  return (
    <div>
      <div className="my-32">{closeButton}</div>
      <div>
        <p>
          Nutzen Sie die folgenden Erklärungen und Beispiele, um Ihr Elterngeld
          zu planen. Im nächsten Schritt entscheiden Sie, welches Elterngeld für
          Sie passt.
        </p>

        <p>WIP!</p>
      </div>
      <div className="my-24">{closeButton}</div>
    </div>
  );
}
