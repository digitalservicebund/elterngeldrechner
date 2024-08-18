import { ReactNode } from "react";
import { KontingentUebersicht } from "./KontingentUebersicht";
import { Lebensmonatsliste } from "./Lebensmonatsliste";
import type {
  BestimmeAuswahlmoeglichkeiten,
  ErstelleUngeplantenLebensmonat,
  WaehleOption,
} from "@/features/planer/user-interface/service/callbackTypes";
import {
  type Elternteil,
  type Lebensmonate,
  type VerfuegbaresKontingent,
  type VerplantesKontingent,
} from "@/features/planer/user-interface/service";

type Props<E extends Elternteil> = {
  readonly lebensmonate: Lebensmonate<E>;
  readonly verfuegbaresKontingent: VerfuegbaresKontingent;
  readonly verplantesKontingent: VerplantesKontingent;
  readonly erstelleUngeplantenLebensmonat: ErstelleUngeplantenLebensmonat<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<E>;
  readonly waehleOption: WaehleOption<E>;
};

export function Planer<E extends Elternteil>({
  lebensmonate,
  verfuegbaresKontingent,
  verplantesKontingent,
  erstelleUngeplantenLebensmonat,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
}: Props<E>): ReactNode {
  return (
    <div className="flex flex-col divide-x-0 divide-y-2 divide-solid divide-off-white border-2 border-solid border-off-white">
      <Lebensmonatsliste
        className="py-8"
        lebensmonate={lebensmonate}
        erstelleUngeplantenLebensmonat={erstelleUngeplantenLebensmonat}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        waehleOption={waehleOption}
      />

      <KontingentUebersicht
        className="bg-off-white py-16"
        verfuegbaresKontingent={verfuegbaresKontingent}
        verplantesKontingent={verplantesKontingent}
      />
    </div>
  );
}
