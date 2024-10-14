import { setTrackingVariable } from "./data-layer";

export function trackPartnerschaftlicheVerteilung(
  auswahlProMonatProElternteil: Auswahl[][],
): void {
  const numberOfElternteile = auswahlProMonatProElternteil.length;
  const hasMultipleElternteile = numberOfElternteile > 1;

  if (hasMultipleElternteile) {
    const verteilung = calculatePartnerschaftlichkeiteVerteilung(
      auswahlProMonatProElternteil,
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
  auswahlProMonatProElternteil: Auswahl[][],
): number | undefined {
  const valueET1 = calculateValueOfElternteil(
    auswahlProMonatProElternteil[0] ?? [],
  );
  const valueET2 = calculateValueOfElternteil(
    auswahlProMonatProElternteil[1] ?? [],
  );

  const smallerValue = Math.min(valueET1, valueET2);
  const biggerValue = Math.max(valueET1, valueET2);

  const hasNoPartnerschaftlichkeit = biggerValue === 0;
  const quotient = smallerValue / biggerValue;

  return hasNoPartnerschaftlichkeit ? 0 : quotient;
}

/**
 * The calculated "value" for an Elternteil is a unit less numeric value that
 * represents the sum of all the Monate planned for this Elternteil. Therefore,
 * each planned Monat get weighted based on the chosen Option.
 */
function calculateValueOfElternteil(auswahlProMonat: Auswahl[]): number {
  return auswahlProMonat
    .map((auswahl) =>
      auswahl !== null ? VARIANTE_TO_PARTNERSCHAFTLICHKEITS_VALUE[auswahl] : 0,
    )
    .reduce((sum, value) => sum + value, 0);
}

const VARIANTE_TO_PARTNERSCHAFTLICHKEITS_VALUE: Record<Variante, number> = {
  Basis: 1,
  Plus: 0.5,
  Bonus: 0.5,
};

const TRACKING_VARIABLE_NAME = "partnerschaftlicheverteilung";

type Auswahl = Variante | null;
type Variante = "Basis" | "Plus" | "Bonus";
