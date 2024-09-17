import type { ReactNode } from "react";
import { Variantenplakette } from "@/features/planer/user-interface/component/zusammenfassung/Variantenplakette";
import {
  KeinElterngeld,
  Auswahloption,
  type Monat,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/locale-formatting";

type Props = {
  readonly monat: Monat;
};

export function DatenfeldFuerMonat({ monat }: Props): ReactNode {
  const formattedAuswahl = formatGewaehlteOption(
    monat.gewaehlteOption,
    monat.imMutterschutz,
  );

  return (
    <div className="flex flex-wrap items-start gap-x-8">
      {formattedAuswahl}

      <div className="flex flex-col place-self-center leading-7">
        {!!monat.elterngeldbezug && formatAsCurrency(monat.elterngeldbezug)}
      </div>
    </div>
  );
}

function formatGewaehlteOption(
  option: Auswahloption | undefined,
  imMutterschutz: boolean,
): ReactNode {
  if (imMutterschutz) {
    return "Mutterschutz";
  } else if (option === undefined || option === KeinElterngeld) {
    return <span className="basis-full">- kein Elterngeld -</span>;
  } else {
    return <Variantenplakette variante={option} />;
  }
}
