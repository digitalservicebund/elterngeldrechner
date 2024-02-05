import { EgrBerechnungParamId } from "./egr-berechnung-param-id";

describe("egr-berechnung-param-id", () => {
  it("pausch has correct precision", () => {
    expect(EgrBerechnungParamId.PAUSCH.toString()).toBe(
      "83.33333333333333333333333333333333",
    );
  });
});
