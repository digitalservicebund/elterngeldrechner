import { useCallback, useEffect, useRef, useState } from "react";
import { errechneteElterngeldbezuegeSelector } from "./errechneteElterngeldbezuegeSelector";
import { composeAusgangslage } from "./composeAusgangslage";
import type { WaehleOption } from "./callbackTypes";
import { validierePlanFuerFinaleAbgabe } from "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe";
import {
  bestimmeVerfuegbaresKontingent,
  type Elternteil,
  erstelleInitialenLebensmonat,
  zaehleVerplantesKontingent,
  aktualisiereErrechneteElterngelbezuege,
  bestimmeAuswahlmoeglichkeiten,
  erstelleInitialenPlan,
  waehleOption,
  setzePlanZurueck,
  type PlanMitBeliebigenElternteilen,
  berechneGesamtsumme,
} from "@/features/planer/user-interface/service";
import { useAppSelector, useAppStore } from "@/redux/hooks";
import { trackPartnerschaftlicheVerteilung } from "@/user-tracking";

export function usePlanerService(
  initialPlan: PlanMitBeliebigenElternteilen | undefined,
  onPlanChanged: (plan: PlanMitBeliebigenElternteilen | undefined) => void,
) {
  const store = useAppStore();
  const errechneteElterngeldbezuege = useAppSelector(
    errechneteElterngeldbezuegeSelector,
  );

  const [plan, setPlan] = useState(() => {
    if (initialPlan != undefined) {
      return initialPlan;
    } else {
      const state = store.getState();
      const ausgangslage = composeAusgangslage(state);
      return erstelleInitialenPlan(ausgangslage, errechneteElterngeldbezuege);
    }
  });

  const verfuegbaresKontingent = useRef(
    bestimmeVerfuegbaresKontingent(plan.ausgangslage),
  );

  const [verplantesKontingent, setVerplantesKontingent] = useState(() =>
    zaehleVerplantesKontingent(plan.lebensmonate),
  );

  const [gesamtsumme, setGesamtsumme] = useState(() =>
    berechneGesamtsumme(plan),
  );

  const [validierungsfehler, setValidierungsfehler] = useState<string[]>(() =>
    validierePlanFuerFinaleAbgabe(plan).mapOrElse(
      () => [],
      extractFehlernachrichten,
    ),
  );

  const updateStateAndTriggerCallbacks = useCallback(
    (nextPlan: PlanMitBeliebigenElternteilen) => {
      trackPartnerschaftlicheVerteilung(nextPlan);

      const nextVerplantesKontingent = zaehleVerplantesKontingent(
        nextPlan.lebensmonate,
      );
      setVerplantesKontingent(nextVerplantesKontingent);

      const nextGesamtsumme = berechneGesamtsumme(nextPlan);
      setGesamtsumme(nextGesamtsumme);

      const nextValidierungsfehler: string[] = validierePlanFuerFinaleAbgabe(
        nextPlan,
      ).mapOrElse(() => [], extractFehlernachrichten);
      setValidierungsfehler(nextValidierungsfehler);

      const istPlanGueltig = nextValidierungsfehler.length === 0;

      if (istPlanGueltig) {
        onPlanChanged?.(nextPlan);
      } else {
        onPlanChanged?.(undefined);
      }
    },
    [onPlanChanged],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleUngeplantenLebensmonatCallback = useCallback(
    erstelleInitialenLebensmonat.bind(null, plan.ausgangslage),
    [plan],
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
            // eslint-disable-next-line no-console
            console.error(error);

            return plan;
          },
        );

        updateStateAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [updateStateAndTriggerCallbacks],
  );

  const setztePlanZurueckCallback = useCallback(
    () =>
      setPlan((plan) => {
        const nextPlan = setzePlanZurueck(plan);
        updateStateAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [updateStateAndTriggerCallbacks],
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
    geburtsdatumDesKindes: plan.ausgangslage.geburtsdatumDesKindes,
    lebensmonate: plan.lebensmonate,
    verfuegbaresKontingent: verfuegbaresKontingent.current,
    verplantesKontingent,
    gesamtsumme,
    validierungsfehler,
    erstelleUngeplantenLebensmonat: erstelleUngeplantenLebensmonatCallback,
    bestimmeAuswahlmoeglichkeiten: bestimmeAuswahlmoeglichkeitenCallback,
    waehleOption: waehleOptionCallback,
    setzePlanZurueck: setztePlanZurueckCallback,
  };
}

function extractFehlernachrichten(violations: { message: string }[]): string[] {
  return violations.map((violation) => violation.message);
}
