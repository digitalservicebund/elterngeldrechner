import Big from "big.js";

export const BIG_ZERO: Big = Big(0);
export const BIG_ONE: Big = Big(1);
export const BIG_100: Big = Big(100);

export function round(value: Big, scale: number = 2): Big {
  return value.round(scale, Big.roundHalfUp);
}

export function aufDenCentRunden(value: number): number {
  const valueInCents = shiftNumberByDecimalsPrecisely(value, 2);
  const roundedValueInCents = Math.round(valueInCents);
  return shiftNumberByDecimalsPrecisely(roundedValueInCents, -2);
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

/**
 * Shifts the decimals place of a number without loosing any precision.
 *
 * JavaScript floating numbers are based on the IEEE 754 standard. Which suffers
 * some precision issues when shifting numbers by simple multiplication. As
 * shifting a decimal number is simply placing the "dot" to "somewhere else",
 * this function implements precise shifting using the string (preservative)
 * representation of a (floating) number.
 *
 * This seems rather hacky, instead of using a more precise number
 * representation library. But the actual question is if such a precision is
 * actually needed. Especially as it basically never applies in practice, nor
 * has a significant impact on the overall calculation result.
 * Anyhow, for backwards compatibility and for established regression tests this
 * was added here in a local manner to stay compliant. In case we should not
 * need this anymore, it is as simple as deleting this function.
 */
function shiftNumberByDecimalsPrecisely(
  value: number,
  decimals: number,
): number {
  const unshiftedValue = value.toString();
  const decimalPlace = unshiftedValue.includes(".")
    ? unshiftedValue.indexOf(".")
    : unshiftedValue.length;

  const shiftedDecimalPlace = decimalPlace + decimals;
  const valueWithoutDot = unshiftedValue.replace(".", "");
  const availableDecimals = valueWithoutDot.length;
  const missingLeadingDigits =
    shiftedDecimalPlace < 0 ? Math.abs(shiftedDecimalPlace) : 0;

  const missingTrailingDigits =
    shiftedDecimalPlace > availableDecimals
      ? shiftedDecimalPlace - availableDecimals
      : 0;

  const valueWithEnoughDigits = [
    stringWithZeros(missingLeadingDigits),
    valueWithoutDot,
    stringWithZeros(missingTrailingDigits),
  ].join("");

  const cutPosition = Math.max(shiftedDecimalPlace, 0);

  const shiftedValue = [
    valueWithEnoughDigits.slice(0, cutPosition),
    ".",
    valueWithEnoughDigits.slice(cutPosition),
  ].join("");

  return Number.parseFloat(shiftedValue);
}

function stringWithZeros(length: number): string {
  return Array(length).fill("0").join("");
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("math utilities", () => {
    describe("shift number by decimals precisely", () => {
      it.each([
        { value: 0, decimals: 7, shiftedValue: 0 },
        { value: 0, decimals: -12, shiftedValue: 0 },
        { value: 1, decimals: 2, shiftedValue: 100 },
        { value: 1, decimals: -3, shiftedValue: 0.001 },
        { value: 1.2345, decimals: 1, shiftedValue: 12.345 },
        { value: 1.2345, decimals: 2, shiftedValue: 123.45 },
        { value: 1.2345, decimals: 4, shiftedValue: 12345 },
        { value: 1.2345, decimals: 6, shiftedValue: 1234500 },
        { value: 1.2345, decimals: -2, shiftedValue: 0.012345 },
        { value: 12.345, decimals: -1, shiftedValue: 1.2345 },
        { value: 0.0123, decimals: -1, shiftedValue: 0.00123 },
      ])(
        "shifts $value by $decimals decimals to $shiftedValue",
        ({ value, decimals, shiftedValue }) => {
          expect(shiftNumberByDecimalsPrecisely(value, decimals)).toBe(
            shiftedValue,
          );
        },
      );

      it("results in the same number if shifting back and forth the same digits", () => {
        const shiftedForward = shiftNumberByDecimalsPrecisely(1.015, 2);
        const shiftedBack = shiftNumberByDecimalsPrecisely(shiftedForward, -2);

        expect(shiftedBack).toBe(1.015);
      });
    });
  });
}
