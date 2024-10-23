import type { ReactNode } from "react";
import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import { Variantenplakette } from "@/features/planer/user-interface/component/zusammenfassung/Variantenplakette";
import {
  KeinElterngeld,
  Auswahloption,
  type Monat,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props = {
  readonly monat: Monat;
};

export function DatenfeldFuerMonat({ monat }: Props): ReactNode {
  const formattedAuswahl = formatGewaehlteOption(
    monat.gewaehlteOption,
    monat.imMutterschutz,
  );

  const optionalesElterngeld = monat.elterngeldbezug ? (
    <span>
      Elterngeld <strong>{formatAsCurrency(monat.elterngeldbezug)}</strong>
      &nbsp;(netto)
    </span>
  ) : null;

  const optionalesEinkommen = monat.bruttoeinkommen ? (
    <span>
      <BusinessCenterOutlined className="mr-4" />
      Einkommen {formatAsCurrency(monat.bruttoeinkommen)}&nbsp;(brutto)
    </span>
  ) : null;

  return (
    <div className="flex flex-wrap items-start gap-x-8">
      {formattedAuswahl}

      <div className="flex flex-col place-self-center leading-7">
        {optionalesElterngeld}
        {optionalesEinkommen}
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
