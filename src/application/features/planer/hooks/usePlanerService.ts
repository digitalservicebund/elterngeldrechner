import { useCallback, useState } from "react";
import { Beispiel } from "@/application/features/beispiele";
import { findeLetztenVerplantenLebensmonat } from "@/application/features/planer/component/Planer/Lebensmonatsliste/findeLetztenVerplantenLebensmonat";
import {
  type Ausgangslage,
  type Auswahloption,
  type BerechneElterngeldbezuegeCallback,
  Elternteil,
  type Lebensmonatszahl,
  type Plan,
  type PlanMitBeliebigenElternteilen,
  Variante,
  aktiviereBonus,
  aktualisiereElterngeldbezuege,
  bestimmeAuswahlmoeglichkeiten,
  ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
  erstelleInitialeLebensmonate,
  erstelleInitialenLebensmonat,
  erstelleVorschlaegeFuerAngabeDesEinkommens,
  gebeEinkommenAn,
  setzePlanZurueck,
  validierePlanFuerFinaleAbgabe,
  waehleOption,
  zaehleVerplantesKontingent,
} from "@/monatsplaner";

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

  const waehleOptionCallback = useCallback(
    (
      lebensmonatszahl: Lebensmonatszahl,
      elternteil: Elternteil,
      option: Auswahloption | undefined,
    ): void => {
      setPlan((plan) => {
        const nextPlan = waehleOption(
          berechneElterngeldbezuege,
          plan,
          lebensmonatszahl,
          elternteil,
          option,
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

  const gebeEinkommenAnCallback = useCallback(
    (
      lebensmonatszahl: Lebensmonatszahl,
      elternteil: Elternteil,
      bruttoeinkommen: number,
    ): void =>
      setPlan((plan) => {
        const planWithEinkommen = gebeEinkommenAn(
          berechneElterngeldbezuege,
          plan,
          lebensmonatszahl,
          elternteil,
          bruttoeinkommen,
        );

        updateStatesAndTriggerCallbacks(planWithEinkommen);
        return planWithEinkommen;
      }),
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks],
  );

  const ergaenzeBruttoeinkommenFuerPartnerschaftsbonusCallback =
    useCallback((): void => {
      setPlan((plan) => {
        const ergaenzterPlan = {
          ...plan,
          lebensmonate: ergaenzeBruttoeinkommenFuerPartnerschaftsbonus(
            plan.lebensmonate,
          ),
        };
        const nextPlan = aktualisiereElterngeldbezuege(
          berechneElterngeldbezuege,
          ergaenzterPlan,
        );
        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      });
    }, [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks]);

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

  const ueberschreibePlan = useCallback(
    (plan: PlanMitBeliebigenElternteilen) =>
      setPlan(() => {
        const nextPlan = aktualisiereElterngeldbezuege(
          berechneElterngeldbezuege,
          plan,
        );

        updateStatesAndTriggerCallbacks(nextPlan);
        return nextPlan;
      }),
    [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks],
  );

  const ueberpruefePlanung = useCallback(
    () => validierePlanFuerFinaleAbgabe(plan),
    [plan],
  );

  const schalteBonusFrei = useCallback(() => {
    const nextPlan = aktiviereBonus(
      berechneElterngeldbezuege,
      plan,
      findeLetztenVerplantenLebensmonat(plan.lebensmonate) as Lebensmonatszahl,
    ).unwrapOrElse((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      return plan;
    });

    setPlan(nextPlan);

    updateStatesAndTriggerCallbacks(nextPlan);

    const verplantesBonusKontingent = zaehleVerplantesKontingent(
      nextPlan.lebensmonate,
    )[Variante.Bonus];
    const letzterVerplanterLebensmonat = findeLetztenVerplantenLebensmonat(
      nextPlan.lebensmonate,
    );

    if (letzterVerplanterLebensmonat) {
      return (letzterVerplanterLebensmonat -
        verplantesBonusKontingent / 2 +
        1) as Lebensmonatszahl;
    } else {
      return undefined;
    }
  }, [berechneElterngeldbezuege, updateStatesAndTriggerCallbacks, plan]);

  return {
    plan,
    validierungsfehler,
    erstelleUngeplantenLebensmonat: erstelleUngeplantenLebensmonatCallback,
    bestimmeAuswahlmoeglichkeiten: bestimmeAuswahlmoeglichkeitenCallback,
    waehleOption: waehleOptionCallback,
    erstelleVorschlaegeFuerAngabeDesEinkommens:
      erstelleVorschlaegeFuerAngabeDesEinkommensCallback,
    gebeEinkommenAn: gebeEinkommenAnCallback,
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus:
      ergaenzeBruttoeinkommenFuerPartnerschaftsbonusCallback,
    setzePlanZurueck: setztePlanZurueckCallback,
    ueberschreibePlan,
    ueberpruefePlanung,
    schalteBonusFrei,
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
  | {
      ausgangslage: Ausgangslage;
      plan?: undefined;
      beispiel?: Beispiel<Ausgangslage>;
    }
  | {
      ausgangslage?: undefined;
      plan: PlanMitBeliebigenElternteilen;
      beispiel?: Beispiel<Ausgangslage>;
    };

export type Callbacks = Partial<{
  onChange: (
    plan: PlanMitBeliebigenElternteilen,
    isPlanGueltig: boolean,
  ) => void;
  onWaehleOption: () => void;
  onSetzePlanZurueck: () => void;
  onPlanungDrucken: () => void;
}>;
