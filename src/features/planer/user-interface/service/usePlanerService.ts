import { useCallback, useEffect, useRef, useState } from "react";
import { errechneteElterngeldbezuegeSelector } from "./errechneteElterngeldbezuegeSelector";
import { composeAusgangslage } from "./composeAusgangslage";
import { type GebeEinkommenAn, WaehleOption } from "./callbackTypes";
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
  gebeEinkommenAn,
  type Ausgangslage,
  type Plan,
  type Lebensmonate,
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

  const { verplantesKontingent, updateVerplantesKontingent } =
    useVerplantesKontingent(plan.lebensmonate);

  const { gesamtsumme, updateGesamtsumme } = useGesamtsumme(plan);

  const { validierungsfehler, updateValidierungsfehler } =
    useValidierungsfehler(plan);

  const updateStatesAndTriggerCallbacks = useCallback(
    (nextPlan: PlanMitBeliebigenElternteilen) => {
      trackPartnerschaftlicheVerteilung(nextPlan);
      updateVerplantesKontingent(nextPlan.lebensmonate);
      updateGesamtsumme(nextPlan);
      const nextValidierungsfehler = updateValidierungsfehler(nextPlan);
      const istPlanGueltig = nextValidierungsfehler.length === 0;

      if (istPlanGueltig) {
        onPlanChanged?.(nextPlan);
      } else {
        onPlanChanged?.(undefined);
      }
    },
    [
      updateVerplantesKontingent,
      updateGesamtsumme,
      updateValidierungsfehler,
      onPlanChanged,
    ],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleUngeplantenLebensmonatCallback = useCallback(
    erstelleInitialenLebensmonat.bind(null, plan.ausgangslage),
    [plan.ausgangslage],
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

        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [updateStatesAndTriggerCallbacks],
  );

  const gebeEinkommenAnCallback = useCallback<GebeEinkommenAn<Elternteil>>(
    (...argumentList) =>
      setPlan((plan) => {
        const nextPlan = gebeEinkommenAn(plan, ...argumentList);
        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [updateStatesAndTriggerCallbacks],
  );

  const setztePlanZurueckCallback = useCallback(
    () =>
      setPlan((plan) => {
        const nextPlan = setzePlanZurueck(plan);
        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [updateStatesAndTriggerCallbacks],
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
    gebeEinkommenAn: gebeEinkommenAnCallback,
    setzePlanZurueck: setztePlanZurueckCallback,
  };
}

function useVerplantesKontingent<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
) {
  const [verplantesKontingent, setVerplantesKontingent] = useState(() =>
    zaehleVerplantesKontingent(lebensmonate),
  );

  const updateVerplantesKontingent = useCallback(
    (lebensmonate: Lebensmonate<E>) =>
      setVerplantesKontingent(zaehleVerplantesKontingent(lebensmonate)),
    [],
  );

  return { verplantesKontingent, updateVerplantesKontingent };
}

function useGesamtsumme<A extends Ausgangslage>(plan: Plan<A>) {
  const [gesamtsumme, setGesamtsumme] = useState(() =>
    berechneGesamtsumme(plan),
  );

  const updateGesamtsumme = useCallback(
    (plan: Plan<A>) => setGesamtsumme(berechneGesamtsumme(plan)),
    [],
  );

  return { gesamtsumme, updateGesamtsumme };
}

function useValidierungsfehler<A extends Ausgangslage>(plan: Plan<A>) {
  const [validierungsfehler, setValidierungsfehler] = useState<string[]>(() =>
    validierePlanFuerFinaleAbgabe(plan).mapOrElse(
      () => [],
      extractFehlernachrichten,
    ),
  );

  const updateValidierungsfehler = useCallback((plan: Plan<A>) => {
    const nextValidierungfehler = validierePlanFuerFinaleAbgabe(plan).mapOrElse(
      () => [],
      extractFehlernachrichten,
    ) satisfies string[];

    setValidierungsfehler(nextValidierungfehler);
    return nextValidierungfehler;
  }, []);

  return { validierungsfehler, updateValidierungsfehler };
}

function extractFehlernachrichten(violations: { message: string }[]): string[] {
  return violations.map((violation) => violation.message);
}
