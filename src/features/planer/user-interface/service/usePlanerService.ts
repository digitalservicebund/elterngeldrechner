import { useCallback, useState } from "react";
import { type GebeEinkommenAn, WaehleOption } from "./callbackTypes";
import {
  type Ausgangslage,
  type BerechneElterngeldbezuegeCallback,
  type Elternteil,
  type Plan,
  type PlanMitBeliebigenElternteilen,
  bestimmeAuswahlmoeglichkeiten,
  erstelleInitialeLebensmonate,
  erstelleInitialenLebensmonat,
  erstelleVorschlaegeFuerAngabeDesEinkommens,
  gebeEinkommenAn,
  setzePlanZurueck,
  validierePlanFuerFinaleAbgabe,
  waehleOption,
} from "@/features/planer/domain";

export function usePlanerService(
  initialInformation: InitialInformation,
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  callbacks?: Callbacks,
) {
  const [plan, setPlan] = useState(
    () =>
      initialInformation.plan ??
      erstelleInitialenPlan(initialInformation.ausgangslage),
  );

  const { validierungsfehler, updateValidierungsfehler } =
    useValidierungsfehler(plan);

  const updateStatesAndTriggerCallbacks = useCallback(
    (nextPlan: PlanMitBeliebigenElternteilen) => {
      const nextValidierungsfehler = updateValidierungsfehler(nextPlan);
      callbacks?.onChange?.(nextPlan, nextValidierungsfehler.length === 0);
    },
    [updateValidierungsfehler, callbacks],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleUngeplantenLebensmonatCallback = useCallback(
    erstelleInitialenLebensmonat.bind(null, plan.ausgangslage),
    [plan.ausgangslage],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const bestimmeAuswahlmoeglichkeitenCallback = useCallback(
    bestimmeAuswahlmoeglichkeiten.bind(null, berechneElterngeldbezuege, plan),
    [berechneElterngeldbezuege, plan],
  );

  const waehleOptionCallback = useCallback<WaehleOption<Elternteil>>(
    (...argumentList) => {
      setPlan((plan) => {
        const nextPlan = waehleOption(
          berechneElterngeldbezuege,
          plan,
          ...argumentList,
        ).unwrapOrElse((error) => {
          // eslint-disable-next-line no-console
          console.error(error);
          return plan;
        });

        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      });

      callbacks?.onWaehleOption?.();
    },
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks, callbacks],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleVorschlaegeFuerAngabeDesEinkommensCallback = useCallback(
    erstelleVorschlaegeFuerAngabeDesEinkommens.bind(null, plan.lebensmonate),
    [plan.lebensmonate],
  );

  const gebeEinkommenAnCallback = useCallback<GebeEinkommenAn<Elternteil>>(
    (...argumentList) =>
      setPlan((plan) => {
        const planWithEinkommen = gebeEinkommenAn(
          berechneElterngeldbezuege,
          plan,
          ...argumentList,
        );

        updateStatesAndTriggerCallbacks(planWithEinkommen);
        return planWithEinkommen;
      }),
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks],
  );

  const setztePlanZurueckCallback = useCallback(
    () =>
      setPlan((plan) => {
        const nextPlan = setzePlanZurueck(plan);
        updateStatesAndTriggerCallbacks(nextPlan);
        callbacks?.onSetzePlanZurueck?.();
        return nextPlan;
      }),
    [updateStatesAndTriggerCallbacks, callbacks],
  );

  return {
    plan,
    validierungsfehler,
    erstelleUngeplantenLebensmonat: erstelleUngeplantenLebensmonatCallback,
    bestimmeAuswahlmoeglichkeiten: bestimmeAuswahlmoeglichkeitenCallback,
    waehleOption: waehleOptionCallback,
    erstelleVorschlaegeFuerAngabeDesEinkommens:
      erstelleVorschlaegeFuerAngabeDesEinkommensCallback,
    gebeEinkommenAn: gebeEinkommenAnCallback,
    setzePlanZurueck: setztePlanZurueckCallback,
  };
}

function erstelleInitialenPlan<A extends Ausgangslage>(
  ausgangslage: A,
): Plan<A> {
  const lebensmonate = erstelleInitialeLebensmonate(ausgangslage);
  return { ausgangslage, lebensmonate };
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

export type InitialInformation =
  | { ausgangslage: Ausgangslage; plan?: undefined }
  | {
      ausgangslage?: undefined;
      plan: PlanMitBeliebigenElternteilen;
    };

export type Callbacks = Partial<{
  onChange: (
    plan: PlanMitBeliebigenElternteilen,
    isPlanGueltig: boolean,
  ) => void;
  onWaehleOption: () => void;
  onSetzePlanZurueck: () => void;
}>;
