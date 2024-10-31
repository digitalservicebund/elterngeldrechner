import { describe, expect, it } from "vitest";
import { PAUSCH } from "@/globals/js/calculations/model/egr-berechnung-param-id";

describe("egr-berechnung-param-id", () => {
  it("pausch has correct precision", () => {
    expect(PAUSCH.toString()).toBe("83.33333333333333333333333333333333");
  });
});
