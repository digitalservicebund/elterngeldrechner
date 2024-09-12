import { ReactNode } from "react";
import classNames from "classnames";
import type { Elterngeldbezug } from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/locale-formatting";
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
        info="Im Mutterschutz gilt automatisch das Basiselterngeld."
      />
    );
  }
}
