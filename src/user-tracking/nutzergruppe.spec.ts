import { setTrackingVariable } from "./data-layer";
import { trackNutzergruppe } from "./nutzergruppe";

vi.mock(import("./data-layer"));

describe("trackNutzergruppe()", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("sets the tracking variabe 'nutzergruppe'", () => {
    trackNutzergruppe(ANY_BIRTHDATE);

    expect(setTrackingVariable).toHaveBeenCalledTimes(1);
    expect(setTrackingVariable).toHaveBeenLastCalledWith(
      "nutzergruppe",
      expect.anything(),
    );
  });

  it.each([
    new Date(2024, 6, 3),
    new Date(2024, 12, 31),
    new Date(2025, 6, 2),
    new Date(2026, 1, 1),
  ])(
    "sets the variable to 'werdene Eltern' if the birthdate is in the future (case #$#)",
    (birthdate) => {
      vi.setSystemTime(new Date(2024, 6, 2));

      trackNutzergruppe(birthdate);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        "werdende Eltern",
      );
    },
  );

  it.each([
    new Date(2024, 6, 2),
    new Date(2024, 6, 1),
    new Date(2024, 4, 5),
    new Date(2024, 3, 3),
    new Date(2024, 3, 2),
  ])(
    "sets the variable to 'junge Eltern' if the birthdate was within the last three months (case #$#)",
    (birthdate: Date) => {
      vi.setSystemTime(new Date(2024, 6, 2));

      trackNutzergruppe(birthdate);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        "junge Eltern",
      );
    },
  );

  it.each([
    new Date(2024, 3, 1),
    new Date(2024, 2, 28),
    new Date(2024, 1, 1),
    new Date(2023, 12, 31),
  ])(
    "sets the variable to 'nachbeantragende Eltern' if the birthdate was in the past longer than three months ago (case #$#)",
    (birthdate: Date) => {
      vi.setSystemTime(new Date(2024, 6, 2));

      trackNutzergruppe(birthdate);

      expect(setTrackingVariable).toHaveBeenCalledWith(
        expect.anything(),
        "nachbeantragende Eltern",
      );
    },
  );
});

const ANY_BIRTHDATE = new Date();
