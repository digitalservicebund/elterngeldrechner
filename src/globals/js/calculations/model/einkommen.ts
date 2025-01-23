/**
 * Einkommen with correct precision fraction 2.
 */
export class Einkommen {
  _value = 0;

  constructor(value: number) {
    this.value = value;
  }

  set value(value: number) {
    this._value = roundOnCent(value);
  }

  get value() {
    return this._value;
  }
}

function roundOnCent(value: number): number {
  const valueInCents = shiftNumberByDecimalsPrecisely(value, 2);
  const roundedValueInCents = Math.round(valueInCents);
  return shiftNumberByDecimalsPrecisely(roundedValueInCents, -2);
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

  describe("Einkommen", () => {
    it.each<[number, number]>([
      [1.0, 1.0],
      [1.011, 1.01],
      [1.015, 1.02],
      [1.016, 1.02],
      [1.298, 1.3],
      [2.997, 3.0],
    ])("rounds input value of %d to %d", (input, output) => {
      const einkommen = new Einkommen(input);

      expect(einkommen.value).toBe(output);
    });

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
