import Big from "big.js";

export const BIG_ZERO: Big = Big(0);
export const BIG_ONE: Big = Big(1);
export const BIG_100: Big = Big(100);

export function round(value: Big, scale: number = 2): Big {
  return value.round(scale, Big.roundHalfUp);
}

/**
 * Äquivalent zu {@link Math#floor(double)} in Java nur für {@link Big}
 *
 * @param b beliebiges {@link Big}
 * @return skaliertes {@link Big}
 */
export function floor(b: Big): Big {
  if (b.lt(BIG_ZERO)) {
    return b.round(0, Big.roundUp);
  } else {
    return b.round(0, Big.roundDown);
  }
}

/**
 * Analog der Funktion Min() aus dem VB-Code. Ermittelt das Minimum der Argumente.
 *
 * @param a beliebiges {@link Big}
 * @param b beliebiges {@link Big}
 * @return das kleinere {@link Big}
 */
export function fMin(a: Big, b: Big): Big {
  return a.lte(b) ? a : b;
}

/**
 * Analog der Funktion Max() aus dem VB-Code. Ermittelt das Maximum der Argumente.
 *
 * @param a beliebiges {@link Big}
 * @param b beliebiges {@link Big}
 * @return das größere {@link Big}
 */
export function fMax(a: Big, b: Big): Big {
  return a.gte(b) ? a : b;
}

/**
 * Returns true if the value of a equals the value of b, otherwise returns false.
 *
 * It's a wrapper function for existing egr code.
 */
export function isEqual(a: Big, b: Big) {
  return a.eq(b);
}

/**
 * Returns true if the value of a is greater than the value of b, otherwise returns false.
 *
 * It's a wrapper function for existing egr code.
 *
 * @throws `NaN` if b is invalid.
 */
export function greater(a: Big, b: Big) {
  return a.gt(b);
}
