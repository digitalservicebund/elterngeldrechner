import { ReactNode } from "react";
import classNames from "classnames";
import type { Elterngeldbezug } from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props = {
  readonly elterngeldbezug?: Elterngeldbezug;
  readonly imMutterschutz?: boolean;
  readonly className?: string;
  readonly ariaHidden?: boolean;
};
export function Elterngeldbezugsanzeige({
  elterngeldbezug,
  imMutterschutz,
  className,
  ariaHidden,
}: Props): ReactNode | undefined {
  if (elterngeldbezug) {
    return (
      <span
        className={classNames("font-bold", className)}
        aria-hidden={ariaHidden}
      >
        {formatAsCurrency(elterngeldbezug)}
      </span>
    );
  }

  if (imMutterschutz) {
    return (
      <InfoDialog
        className={className}
        ariaLabelForDialog="Informationen zum Elterngeldbezug im Mutterschutz"
        info="Sie haben angegeben, dass Sie Mutterschaftsleistungen beziehen. Monate im Mutterschutz gelten grundsätzlich als Monate mit Basiselterngeld. Sind die Mutterschaftsleistungen höher als
        das Elterngeld, bekommen Sie nur die Mutterschaftsleistungen."
      />
    );
  }
}
