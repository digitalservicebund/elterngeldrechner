import Big from "big.js";

/**
 * Preferences for calculations.
 */
export function setupCalculation() {
  /**
   * Default number of decimal places of the results of operations involving division are 20.
   *
   * We use 34 and round half even because:
   *
   * Java Implementation division parameter are MathContext.DECIMAL128.
   *
   * DECIMAL128: A object with a precision setting matching the IEEE 754R Decimal128 format, 34 digits, and a
   * rounding mode of HALF_EVEN, the IEEE 754R default.
   */
  Big.DP = 34;
  Big.RM = Big.roundHalfEven;
}
