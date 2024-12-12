import {
  SteuerKlasse,
  steuerklasseOfNumber,
  steuerklasseToNumber,
} from "./steuer-klasse";

describe("steuer-klasse", () => {
  describe("should return correct number, when SteuerKlasse is", () => {
    it("SKL1", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL1);
      expect(actual).toBe(1);
    });

    it("SKL2", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL2);
      expect(actual).toBe(2);
    });

    it("SKL3", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL3);
      expect(actual).toBe(3);
    });

    it("SKL4", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL4);
      expect(actual).toBe(4);
    });

    it("SKL4_FAKTOR", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL4_FAKTOR);
      expect(actual).toBe(4);
    });

    it("SKL5", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL5);
      expect(actual).toBe(5);
    });

    it("SKL6", () => {
      const actual = steuerklasseToNumber(SteuerKlasse.SKL6);
      expect(actual).toBe(6);
    });
  });

  describe("should return correct SteuerKlasse, when number is", () => {
    it("SKL1", () => {
      const actual = steuerklasseOfNumber(1);
      expect(actual).toBe(SteuerKlasse.SKL1);
    });

    it("SKL2", () => {
      const actual = steuerklasseOfNumber(2);
      expect(actual).toBe(SteuerKlasse.SKL2);
    });

    it("SKL3", () => {
      const actual = steuerklasseOfNumber(3);
      expect(actual).toBe(SteuerKlasse.SKL3);
    });

    it("SKL4", () => {
      const actual = steuerklasseOfNumber(4);
      expect(actual).toBe(SteuerKlasse.SKL4);
    });

    it("SKL5", () => {
      const actual = steuerklasseOfNumber(5);
      expect(actual).toBe(SteuerKlasse.SKL5);
    });

    it("SKL6", () => {
      const actual = steuerklasseOfNumber(6);
      expect(actual).toBe(SteuerKlasse.SKL6);
    });
  });
});
