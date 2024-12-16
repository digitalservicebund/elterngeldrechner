import { useCallback, useRef, useState } from "react";
import {
  type GebeEinkommenAn,
  OptionSelectedCallback,
  type PlanChangedCallback,
  PlanResettedCallback,
  WaehleOption,
} from "./callbackTypes";
import {
  bestimmeVerfuegbaresKontingent,
  type Elternteil,
  type BerechneElterngeldbezuegeCallback,
  erstelleInitialenLebensmonat,
  zaehleVerplantesKontingent,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  setzePlanZurueck,
  type PlanMitBeliebigenElternteilen,
  berechneGesamtsumme,
  gebeEinkommenAn,
  type Ausgangslage,
  type Plan,
  type Lebensmonate,
  erstelleInitialeLebensmonate,
  validierePlanFuerFinaleAbgabe,
  erstelleVorschlaegeFuerAngabeDesEinkommens,
} from "@/features/planer/domain";

export function usePlanerService(
  initialInformation: InitialInformation,
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
  onPlanChanged: PlanChangedCallback,
  onOptionSelected?: OptionSelectedCallback,
  onPlanResetted?: PlanResettedCallback,
) {
  const [plan, setPlan] = useState(
    () =>
      initialInformation.plan ??
      erstelleInitialenPlan(initialInformation.ausgangslage),
  );

  const verfuegbaresKontingent = useRef(
    bestimmeVerfuegbaresKontingent(plan.ausgangslage),
  );

  const { verplantesKontingent, updateVerplantesKontingent } =
    useVerplantesKontingent(plan.lebensmonate);

  const { gesamtsumme, updateGesamtsumme } = useGesamtsumme(plan);

  const { validierungsfehler, updateValidierungsfehler } =
    useValidierungsfehler(plan);

  const updateStatesAndTriggerCallbacks = useCallback(
    (
      nextPlan: PlanMitBeliebigenElternteilen,
      options?: {
        skipVerplantesKontingent?: boolean;
      },
    ) => {
      if (!options?.skipVerplantesKontingent) {
        updateVerplantesKontingent(nextPlan.lebensmonate);
      }

      updateGesamtsumme(nextPlan);

      const nextValidierungsfehler = updateValidierungsfehler(nextPlan);

      onPlanChanged?.(nextPlan, nextValidierungsfehler.length === 0);
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

      onOptionSelected?.();
    },
    [
      berechneElterngeldbezuege,
      onOptionSelected,
      updateStatesAndTriggerCallbacks,
    ],
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

        updateStatesAndTriggerCallbacks(planWithEinkommen, {
          skipVerplantesKontingent: true,
        });

        return planWithEinkommen;
      }),
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks],
  );

  const setztePlanZurueckCallback = useCallback(
    () =>
      setPlan((plan) => {
        const nextPlan = setzePlanZurueck(plan);

        updateStatesAndTriggerCallbacks(nextPlan);

        onPlanResetted?.();

        return nextPlan;
      }),
    [onPlanResetted, updateStatesAndTriggerCallbacks],
  );

  return {
    ausgangslage: plan.ausgangslage,
    lebensmonate: plan.lebensmonate,
    verfuegbaresKontingent: verfuegbaresKontingent.current,
    verplantesKontingent,
    gesamtsumme,
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

export type InitialInformation =
  | { ausgangslage: Ausgangslage; plan?: undefined }
  | {
      ausgangslage?: undefined;
      plan: PlanMitBeliebigenElternteilen;
    };
