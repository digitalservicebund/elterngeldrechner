import { describe, expect, it } from "vitest";
import {
  KinderFreiBetrag,
  kinderFreiBetragOfNumber,
  kinderFreiBetragToNumber,
} from "./kinder-frei-betrag";

describe("kinder-frei-betrag", () => {
  describe("should return correct number of freibetrag, when KinderFreiBetrag is", () => {
    it("ZKF0", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF0);
      expect(actual).toBe(0);
    });

    it("ZKF0_5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF0_5);
      expect(actual).toBe(0.5);
    });

    it("ZKF1", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF1);
      expect(actual).toBe(1);
    });

    it("ZKF1_5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF1_5);
      expect(actual).toBe(1.5);
    });

    it("ZKF2", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF2);
      expect(actual).toBe(2);
    });

    it("ZKF2_5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF2_5);
      expect(actual).toBe(2.5);
    });

    it("ZKF3", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF3);
      expect(actual).toBe(3);
    });

    it("ZKF3_5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF3_5);
      expect(actual).toBe(3.5);
    });

    it("ZKF4", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF4);
      expect(actual).toBe(4);
    });

    it("ZKF4_5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF4_5);
      expect(actual).toBe(4.5);
    });

    it("ZKF5", () => {
      const actual = kinderFreiBetragToNumber(KinderFreiBetrag.ZKF5);
      expect(actual).toBe(5);
    });
  });

  describe("should return correct enum of freibetrag, when KinderFreiBetrag number is", () => {
    it("0", () => {
      const actual = kinderFreiBetragOfNumber(0);
      expect(actual).toBe(KinderFreiBetrag.ZKF0);
    });

    it("0.5", () => {
      const actual = kinderFreiBetragOfNumber(0.5);
      expect(actual).toBe(KinderFreiBetrag.ZKF0_5);
    });

    it("1", () => {
      const actual = kinderFreiBetragOfNumber(1);
      expect(actual).toBe(KinderFreiBetrag.ZKF1);
    });

    it("1.5", () => {
      const actual = kinderFreiBetragOfNumber(1.5);
      expect(actual).toBe(KinderFreiBetrag.ZKF1_5);
    });

    it("2", () => {
      const actual = kinderFreiBetragOfNumber(2);
      expect(actual).toBe(KinderFreiBetrag.ZKF2);
    });

    it("2.5", () => {
      const actual = kinderFreiBetragOfNumber(2.5);
      expect(actual).toBe(KinderFreiBetrag.ZKF2_5);
    });

    it("3", () => {
      const actual = kinderFreiBetragOfNumber(3);
      expect(actual).toBe(KinderFreiBetrag.ZKF3);
    });

    it("3.5", () => {
      const actual = kinderFreiBetragOfNumber(3.5);
      expect(actual).toBe(KinderFreiBetrag.ZKF3_5);
    });

    it("4", () => {
      const actual = kinderFreiBetragOfNumber(4);
      expect(actual).toBe(KinderFreiBetrag.ZKF4);
    });

    it("4.5", () => {
      const actual = kinderFreiBetragOfNumber(4.5);
      expect(actual).toBe(KinderFreiBetrag.ZKF4_5);
    });

    it("5", () => {
      const actual = kinderFreiBetragOfNumber(5);
      expect(actual).toBe(KinderFreiBetrag.ZKF5);
    });

    it("unknown", () => {
      const actual = kinderFreiBetragOfNumber(6);
      expect(actual).toBeUndefined();
    });
  });
});
