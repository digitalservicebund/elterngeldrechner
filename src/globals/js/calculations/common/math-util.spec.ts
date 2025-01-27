import Big from "big.js";
import { describe, expect, it } from "vitest";
import { aufDenCentRunden, fMin, floor, round } from "./math-util";

describe("math-util", () => {
  describe("round half up with precision 2:", () => {
    it("0.444", () => {
      expect(round(Big(0.444)).toString()).toBe("0.44");
    });

    it("0.555", () => {
      expect(round(Big(0.555)).toString()).toBe("0.56");
    });
  });

  describe("round half up", () => {
    it("0.4444 with precision 3", () => {
      expect(round(Big(0.4444), 3).toString()).toBe("0.444");
    });

    it("0.4444 with precision 2", () => {
      expect(round(Big(0.4444), 2).toString()).toBe("0.44");
    });

    it("0.4444 with precision 1", () => {
      expect(round(Big(0.4444), 1).toString()).toBe("0.4");
    });

    it("0.4444 with precision 0", () => {
      expect(round(Big(0.4444), 0).toString()).toBe("0");
    });

    it("0.5555 with precision 3", () => {
      expect(round(Big(0.5555), 3).toString()).toBe("0.556");
    });

    it("0.5555 with precision 2", () => {
      expect(round(Big(0.5555), 2).toString()).toBe("0.56");
    });

    it("0.5555 with precision 1", () => {
      expect(round(Big(0.5555), 1).toString()).toBe("0.6");
    });

    it("0.5555 with precision 0", () => {
      expect(round(Big(0.5555), 0).toString()).toBe("1");
    });
  });

  it.each([
    [1.0, 1.0],
    [1.5, 1.5],
    [1.011, 1.01],
    [1.015, 1.02],
    [1.016, 1.02],
    [1.298, 1.3],
    [2.997, 3.0],
  ])(
    "correctly rounds input of %d on the cent digit to %d",
    (input, output) => {
      expect(aufDenCentRunden(input)).toBe(output);
    },
  );

  describe.each([
    [-1.6, -2.0],
    [-1.4, -2.0],
    [-1.0, -1.0],
    [0, 0.0],
    [0.4, 0.0],
    [0.5, 0.0],
    [0.6, 0.0],
    [1, 1.0],
    [1.1, 1.0],
    [1.5, 1.0],
    [1.6, 1.0],
    [2, 2.0],
    [2.1, 2.0],
  ])("floor(%d) == %d", (input, output) => {
    it("should round with floor", () => {
      // when
      const actual = floor(Big(input));

      // then
      expect(actual.toString()).toBe(Big(output).toString());
    });
  });

  describe.each([
    [-1.6, -2, -2],
    [-1.6, -1.600001, -1.600001],
    [-1.6, -1.6, -1.6],
    [-1.6, 0, -1.6],
    [1.6, 0, 0],
    [1.6, 100, 1.6],
  ])("minimum of %d and %d is %d", (inputA, inputB, output) => {
    it("should determine minimum", () => {
      // when
      const actual = fMin(Big(inputA), Big(inputB));

      // then
      expect(actual.toString()).toBe(Big(output).toString());
    });

    it("should determine minimum with reversed arguments", () => {
      // when
      const actual = fMin(Big(inputB), Big(inputA));

      // then
      expect(actual.toString()).toBe(Big(output).toString());
    });
  });
});
