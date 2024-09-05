import { setTrackingVariable } from "./data-layer";
import {
  Elternteil,
  KeinElterngeld,
  Variante,
  type Ausgangslage,
  type Auswahloption,
  type Lebensmonate,
} from "@/features/planer/domain";
import type { Plan } from "@/features/planer/domain/plan";
import type { Monat } from "@/features/planer/domain/monat";

export function trackPartnerschaftlicheVerteilung(
  plan: Plan<Ausgangslage>,
): void {
  if (plan.ausgangslage.anzahlElternteile > 1) {
    const verteilung = calculatePartnerschaftlichkeiteVerteilung(
      plan.lebensmonate,
    );
    setTrackingVariable(TRACKING_VARIABLE_NAME, verteilung);
  }
}

/**
 * This is a small algorithm which calculates a quotient of how well the planned
 * months are distributed between both partners. A quotient of `0` means no
 * distribution at all, while `1` means completely equal distribution. This takes
 * into account the different variants partners can choose from and assigns
 * balanced values to them.
 *
 * @returns quotient between 0 and 1 of the distribution
 */
function calculatePartnerschaftlichkeiteVerteilung(
  lebensmonate: Lebensmonate<Elternteil>,
): number | undefined {
  const valueET1 = calculateValueOfElternteil(
    filterMonateOfElternteil(lebensmonate, Elternteil.Eins),
  );
  const valueET2 = calculateValueOfElternteil(
    filterMonateOfElternteil(lebensmonate, Elternteil.Zwei),
  );

  const smallerValue = Math.min(valueET1, valueET2);
  const biggerValue = Math.max(valueET1, valueET2);

  const hasNoPartnerschaftlichkeit = biggerValue === 0;
  const quotient = smallerValue / biggerValue;

  return hasNoPartnerschaftlichkeit ? 0 : quotient;
}

function filterMonateOfElternteil<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
  elternteil: E,
): Monat[] {
  return Object.values(lebensmonate).map(
    (lebensmonat) => lebensmonat[elternteil],
  );
}

/**
 * The calculated "value" for an Elternteil is a unit less numeric value that
 * represents the sum of all the Monate planned for this Elternteil. Therefore,
 * each planned Monat get weighted based on the chosen Option.
 */
function calculateValueOfElternteil(monate: Monat[]): number {
  return monate
    .map((monat) => monat.gewaehlteOption)
    .map((option) =>
      option !== undefined
        ? AUSWAHLOPTION_TO_PARTNERSCHAFTLICHKEITS_VALUE[option]
        : 0,
    )
    .reduce((sum, value) => sum + value, 0);
}

const AUSWAHLOPTION_TO_PARTNERSCHAFTLICHKEITS_VALUE: Record<
  Auswahloption,
  number
> = {
  [Variante.Basis]: 1,
  [Variante.Plus]: 0.5,
  [Variante.Bonus]: 0.5,
  [KeinElterngeld]: 0,
};

const TRACKING_VARIABLE_NAME = "partnerschaftlicheverteilung";
