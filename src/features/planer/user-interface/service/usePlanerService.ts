import { useCallback, useEffect, useRef, useState } from "react";
import { errechneteElterngeldbezuegeSelector } from "./errechneteElterngeldbezuegeSelector";
import { ausgangslageSelector } from "./ausgangslageSelector";
import type { WaehleOption } from "./callbackTypes";
import {
  bestimmeVerfuegbaresKontingent,
  type Elternteil,
  erstelleInitialenLebensmonat,
  zaehleVerplantesKontingent,
  aktualisiereErrechneteElterngelbezuege,
  bestimmeAuswahlmoeglichkeiten,
  erstelleInitialenPlan,
  waehleOption,
} from "@/features/planer/user-interface/service";
import { useAppSelector } from "@/redux/hooks";

export function usePlanerService() {
  const ausgangslage = useAppSelector(ausgangslageSelector, () => true);
  const errechneteElterngeldbezuege = useAppSelector(
    errechneteElterngeldbezuegeSelector,
  );

  const [plan, setPlan] = useState(() =>
    erstelleInitialenPlan(ausgangslage, errechneteElterngeldbezuege),
  );

  const verfuegbaresKontingent = useRef(
    bestimmeVerfuegbaresKontingent(ausgangslage),
  );

  const [verplantesKontingent, setVerplantesKontingent] = useState(() =>
    zaehleVerplantesKontingent(plan.lebensmonate),
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleUngeplantenLebensmonatCallback = useCallback(
    erstelleInitialenLebensmonat.bind(null, ausgangslage),
    [ausgangslage],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bestimmeAuswahlmoeglichkeitenCallback = useCallback(
    bestimmeAuswahlmoeglichkeiten.bind(null, plan),
    [plan],
  );

  const waehleOptionCallback = useCallback<WaehleOption<Elternteil>>(
    (...argumentList) =>
      setPlan((plan) => {
        const nextPlan = waehleOption(plan, ...argumentList).unwrapOrElse(
          (error) => {
            console.error(error);
            return plan;
          },
        );

        setVerplantesKontingent(
          zaehleVerplantesKontingent(nextPlan.lebensmonate),
        );

        return nextPlan;
      }),
    [],
  );

  useEffect(
    () =>
      setPlan((plan) =>
        aktualisiereErrechneteElterngelbezuege(
          plan,
          errechneteElterngeldbezuege,
        ),
      ),
    [errechneteElterngeldbezuege],
  );

  return {
    pseudonymeDerElternteile: plan.ausgangslage.pseudonymeDerElternteile,
    lebensmonate: plan.lebensmonate,
    verfuegbaresKontingent: verfuegbaresKontingent.current,
    verplantesKontingent,
    erstelleUngeplantenLebensmonat: erstelleUngeplantenLebensmonatCallback,
    bestimmeAuswahlmoeglichkeiten: bestimmeAuswahlmoeglichkeitenCallback,
    waehleOption: waehleOptionCallback,
  };
}
