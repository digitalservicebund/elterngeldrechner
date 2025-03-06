import { aufDenCentRunden } from "@/elterngeldrechner/common/math-util";

/**
 * Einkommen with correct precision fraction 2.
 */
export class Einkommen {
  _value = 0;

  constructor(value: number) {
    this.value = value;
  }

  set value(value: number) {
    this._value = aufDenCentRunden(value);
  }

  get value() {
    return this._value;
  }
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
  });
}
