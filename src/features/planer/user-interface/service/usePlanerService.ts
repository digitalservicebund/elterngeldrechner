import { useCallback, useRef, useState } from "react";
import {
  type BerechneElterngeldbezuegeCallback,
  type GebeEinkommenAn,
  type PlanChangedCallback,
  WaehleOption,
} from "./callbackTypes";
import { erstelleVorschlaegeFuerAngabeDesEinkommens } from "@/features/planer/domain";
import { validierePlanFuerFinaleAbgabe } from "@/features/planer/domain/plan/operation/validierePlanFuerFinaleAbgabe";
import {
  bestimmeVerfuegbaresKontingent,
  type Elternteil,
  erstelleInitialenLebensmonat,
  zaehleVerplantesKontingent,
  aktualisiereErrechneteElterngelbezuege,
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
} from "@/features/planer/user-interface/service";
import { MatomoTrackingMetrics } from "@/features/planer/domain/plan";

export function usePlanerService(
  initialInformation: InitialInformation,
  onPlanChanged: PlanChangedCallback,
  berechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
) {
  const [plan, setPlan] = useState(
    () =>
      initialInformation.plan ??
      erstelleInitialenPlan(
        initialInformation.ausgangslage,
        berechneElterngeldbezuege,
      ),
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
      nextPlan: PlanMitBeliebigenElternteilen & MatomoTrackingMetrics,
      options?: {
        skipVerplantesKontingent?: boolean;
      },
    ) => {
      if (!options?.skipVerplantesKontingent) {
        updateVerplantesKontingent(nextPlan.lebensmonate);
      }

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const erstelleVorschlaegeFuerAngabeDesEinkommensCallback = useCallback(
    erstelleVorschlaegeFuerAngabeDesEinkommens.bind(null, plan.lebensmonate),
    [plan.lebensmonate],
  );

  const gebeEinkommenAnCallback = useCallback<GebeEinkommenAn<Elternteil>>(
    (...argumentList) =>
      setPlan((plan) => {
        const planWithEinkommen = gebeEinkommenAn(plan, ...argumentList);
        const elterngeldbezuege = berechneElterngeldbezuege(
          planWithEinkommen.lebensmonate,
        );
        const planWithElterngeldbezuegen =
          aktualisiereErrechneteElterngelbezuege(
            planWithEinkommen,
            elterngeldbezuege,
          );

        updateStatesAndTriggerCallbacks(planWithElterngeldbezuegen, {
          skipVerplantesKontingent: true,
        });

        return planWithElterngeldbezuegen;
      }),
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks],
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
    erstelleVorschlaegeFuerAngabeDesEinkommens:
      erstelleVorschlaegeFuerAngabeDesEinkommensCallback,
    gebeEinkommenAn: gebeEinkommenAnCallback,
    setzePlanZurueck: setztePlanZurueckCallback,
  };
}

function erstelleInitialenPlan<A extends Ausgangslage>(
  ausgangslage: A,
  berrechneElterngeldbezuege: BerechneElterngeldbezuegeCallback,
): Plan<A> & MatomoTrackingMetrics {
  const lebensmonate = erstelleInitialeLebensmonate(ausgangslage);
  const errechneteElterngeldbezuege = berrechneElterngeldbezuege(lebensmonate);

  return {
    ausgangslage,
    lebensmonate,
    errechneteElterngeldbezuege,
    changes: 0,
    resets: 0,
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

export type InitialInformation =
  | { ausgangslage: Ausgangslage; plan?: undefined }
  | {
      ausgangslage?: undefined;
      plan: PlanMitBeliebigenElternteilen & MatomoTrackingMetrics;
    };
