import GehaltIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import classNames from "classnames";
import type { ReactNode } from "react";
import { Variante, type Lebensmonat } from "./types";
import { ElterngeldvarianteBadge } from "@/components/atoms/ElterngeldVarianteBadge";
import { formatAsCurrency } from "@/utils/locale-formatting";

interface Props extends Lebensmonat {}

export function PlanungsdetailsMonth({
  variante,
  isMutterschutzMonth,
  elterngeld,
  nettoEinkommen,
  verfuegbaresEinkommen,
}: Props): ReactNode {
  const variantenElement = formatVarianteAsElement(
    variante,
    isMutterschutzMonth,
  );

  const hasElterngeld = elterngeld > 0;
  const hasNettoEinkommen = nettoEinkommen > 0 && !isMutterschutzMonth;
  const hasOnlyElterngeld = hasElterngeld && !hasNettoEinkommen;
  const hasOnlyNettoEinkommen = hasNettoEinkommen && !hasElterngeld;
  const showVerfuegbaresEinkommen = hasElterngeld && hasNettoEinkommen;

  return (
    <div className="flex flex-wrap items-start gap-x-8">
      {variantenElement}

      <div className="flex flex-col place-self-center leading-7">
        {!!hasElterngeld && (
          <span className={classNames({ "font-bold": hasOnlyElterngeld })}>
            {formatAsCurrency(elterngeld)}
          </span>
        )}

        {!!hasNettoEinkommen && (
          <span>
            <GehaltIcon /> Einkommen{" "}
            <span
              className={classNames({ "font-bold": hasOnlyNettoEinkommen })}
            >
              {formatAsCurrency(nettoEinkommen)}
            </span>
          </span>
        )}

        {!!showVerfuegbaresEinkommen && (
          <span className="mt-8 font-bold">
            = <span className="sr-only">verfügbares Einkommen</span>
            {formatAsCurrency(verfuegbaresEinkommen)}
          </span>
        )}
      </div>
    </div>
  );
}

function formatVarianteAsElement(
  variante: Variante,
  isMutterschutzMonth: boolean,
): ReactNode {
  if (isMutterschutzMonth) {
    return "Mutterschutz";
  } else if (variante === "None") {
    return <span className="basis-full">- kein Elterngeld -</span>;
  } else {
    return (
      <ElterngeldvarianteBadge variante={variante} className="min-w-[7ch]" />
    );
  }
}
