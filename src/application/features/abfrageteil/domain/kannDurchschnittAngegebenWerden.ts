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

  const taetigkeitenAngaben = {
    istNichtSelbststaendig: false,
    istSelbststaendig: false,
    istVerbeamtet: false,
    hatAndereLeistungen: false,
    hatPeriodenOhneEinkommen: false,
  };

  describe("kannDurchschnittAngegebenWerden", () => {
    it("returns true when neither hatPeriodenOhneEinkommen nor hatAndereLeistungen is set", () => {
      expect(kannDurchschnittAngegebenWerden(taetigkeitenAngaben)).toBe(true);
    });

    it("returns false when hatPeriodenOhneEinkommen is true", () => {
      expect(
        kannDurchschnittAngegebenWerden({
          ...taetigkeitenAngaben,
          hatPeriodenOhneEinkommen: true,
        }),
      ).toBe(false);
    });

    it("returns false when hatAndereLeistungen is true", () => {
      expect(
        kannDurchschnittAngegebenWerden({
          ...taetigkeitenAngaben,
          hatAndereLeistungen: true,
        }),
      ).toBe(false);
    });

    it("returns false when both hatPeriodenOhneEinkommen and hatAndereLeistungen are true", () => {
      expect(
        kannDurchschnittAngegebenWerden({
          ...taetigkeitenAngaben,
          hatPeriodenOhneEinkommen: true,
          hatAndereLeistungen: true,
        }),
      ).toBe(false);
    });
  });
}
