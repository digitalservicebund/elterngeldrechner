import BusinessCenterOutlined from "@digitalservicebund/icons/BusinessCenterOutlined";
import type { ReactNode } from "react";
import {
  Geldbetrag,
  Variantenplakette,
} from "@/application/features/planer/component/common";
import { type Auswahloption, KeinElterngeld, type Monat } from "@/monatsplaner";

type Props = {
  readonly monat: Monat;
};

export function DatenfeldFuerMonat({ monat }: Props): ReactNode {
  const formattedAuswahl = formatGewaehlteOption(
    monat.gewaehlteOption,
    monat.imMutterschutz,
  );

  const optionalesElterngeld = monat.elterngeldbezug && (
    <span>
      Elterngeld{" "}
      <Geldbetrag className="font-bold" betrag={monat.elterngeldbezug} />
    </span>
  );

  const optionalesEinkommen = monat.bruttoeinkommen && (
    <span>
      <BusinessCenterOutlined className="mr-4" />
      Einkommen <Geldbetrag betrag={monat.bruttoeinkommen} />
      &nbsp;(brutto)
    </span>
  );

  return (
    <div className="flex flex-wrap items-start gap-x-8">
      <div className="flex items-center gap-x-8">
        {formattedAuswahl}
        {optionalesElterngeld}
      </div>

      <div className="w-full">{optionalesEinkommen}</div>
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
