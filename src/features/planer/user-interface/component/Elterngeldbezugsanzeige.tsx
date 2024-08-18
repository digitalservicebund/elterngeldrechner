import { ReactNode, useId } from "react";
import classNames from "classnames";
import type { Elterngeldbezug } from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/locale-formatting";
import { InfoDialog } from "@/components/molecules/info-dialog";

type Props = {
  readonly elterngeldbezug?: Elterngeldbezug;
  readonly imMutterschutz?: boolean;
  readonly className?: string;
};
export function Elterngeldbezugsanzeige({
  elterngeldbezug,
  imMutterschutz,
  className,
}: Props): ReactNode | undefined {
  const infoIdentifier = useId();

  if (elterngeldbezug) {
    return (
      <span className={classNames("font-bold", className)}>
        {formatAsCurrency(elterngeldbezug)}
      </span>
    );
  }

  if (imMutterschutz) {
    return (
      <InfoDialog
        className={className}
        info={{ id: infoIdentifier, text: INFO_TEXT }}
      />
    );
  }
}

// TODO: Improve based in design/product/partners...
const INFO_TEXT = "Im Mutterschutz gilt automatisch das Basiselterngeld.";
