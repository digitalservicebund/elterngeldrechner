import { describe, expect, it } from "vitest";
import { Einkommen } from "./einkommen";

describe("einkommen-types", () => {
  describe("creates Einkommen with correct precision of", () => {
    it("0", () => {
      expect(new Einkommen(0).value.toString()).toBe("0");
    });

    it("0.0", () => {
      expect(new Einkommen(0.0).value.toString()).toBe("0");
    });

    it("1.01", () => {
      expect(new Einkommen(1.01).value.toString()).toBe("1.01");
    });

    it("1.0100001", () => {
      expect(new Einkommen(1.0100001).value.toString()).toBe("1.01");
    });

    it("1.011", () => {
      expect(new Einkommen(1.011).value.toString()).toBe("1.01");
    });

    it("1.014", () => {
      expect(new Einkommen(1.014).value.toString()).toBe("1.01");
    });

    it("1.015", () => {
      expect(new Einkommen(1.015).value.toString()).toBe("1.02");
    });

    it("1000999000.015", () => {
      expect(new Einkommen(1000999000.015).value.toString()).toBe(
        "1000999000.02",
      );
    });
  });
});
