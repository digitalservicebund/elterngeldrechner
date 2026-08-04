import type { ElternteilTaetigkeitenAbfrage } from "@/application/features/abfrageteil/pages/elternteil";

export function kannDurchschnittAngegebenWerden(
  taetigkeiten: ElternteilTaetigkeitenAbfrage,
): boolean {
  return (
    !taetigkeiten.hatPeriodenOhneEinkommen && !taetigkeiten.hatAndereLeistungen
  );
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const base = {
    istNichtSelbststaendig: false,
    istSelbststaendig: false,
    istVerbeamtet: false,
    hatAndereLeistungen: false,
    hatPeriodenOhneEinkommen: false,
  };

  describe("kannDurchschnittAngegebenWerden", () => {
    it("returns true when neither hatPeriodenOhneEinkommen nor hatAndereLeistungen is set", () => {
      expect(kannDurchschnittAngegebenWerden(base)).toBe(true);
    });

    it("returns false when hatPeriodenOhneEinkommen is true", () => {
      expect(
        kannDurchschnittAngegebenWerden({
          ...base,
          hatPeriodenOhneEinkommen: true,
        }),
      ).toBe(false);
    });

    it("returns false when hatAndereLeistungen is true", () => {
      expect(
        kannDurchschnittAngegebenWerden({ ...base, hatAndereLeistungen: true }),
      ).toBe(false);
    });

    it("returns false when both hatPeriodenOhneEinkommen and hatAndereLeistungen are true", () => {
      expect(
        kannDurchschnittAngegebenWerden({
          ...base,
          hatPeriodenOhneEinkommen: true,
          hatAndereLeistungen: true,
        }),
      ).toBe(false);
    });
  });
}
