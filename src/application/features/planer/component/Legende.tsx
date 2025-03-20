import { ReactNode } from "react";
import { Variantenplakette } from "./Variantenplakette";
import { Variante } from "@/monatsplaner";

type Props = {
  readonly children?: ReactNode;
  readonly showBasis?: boolean;
  readonly showPlus?: boolean;
  readonly showBonus?: boolean;
  readonly showKeinElterngeld?: boolean;
};

export function Legende({
  children,
  showBasis,
  showPlus,
  showBonus,
  showKeinElterngeld,
}: Props): ReactNode {
  return (
    <div className="flex flex-col gap-y-16 rounded bg-off-white p-16">
      <ul className="flex flex-wrap gap-x-32 gap-y-16">
        {!!showBasis && (
          <li className="flex items-center gap-8">
            <span>
              <Variantenplakette variante={Variante.Basis} />
            </span>
            <span className="whitespace-nowrap">= {Variante.Basis}</span>
          </li>
        )}
        {!!showPlus && (
          <li className="flex items-center gap-8">
            <Variantenplakette variante={Variante.Plus} />
            <span className="whitespace-nowrap">= {Variante.Plus}</span>
          </li>
        )}
        {!!showBonus && (
          <li className="flex items-center gap-8">
            <Variantenplakette variante={Variante.Bonus} />
            <span className="whitespace-nowrap">= {Variante.Bonus}</span>
          </li>
        )}
        {!!showKeinElterngeld && (
          <li className="flex items-center gap-8">
            <Variantenplakette variante="Kein Elterngeld" />
            <span className="whitespace-nowrap">= Kein Elterngeld</span>
          </li>
        )}
      </ul>
      <div>{children}</div>
    </div>
  );
}
