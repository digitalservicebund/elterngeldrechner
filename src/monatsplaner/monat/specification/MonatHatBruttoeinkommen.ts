import { Specification } from "@/monatsplaner/common/specification";
import { Monat } from "@/monatsplaner/monat/Monat";

export const MonatHatBruttoeinkommen = Specification.fromPredicate<Monat>(
  "Monat hat kein Bruttoeinkommen",
  (monat) => !!monat.bruttoeinkommen && monat.bruttoeinkommen > 0,
);

if (import.meta.vitest) {
  const { describe, test, it, expect } = import.meta.vitest;

  describe("Monat hat Bruttoeinkommen", async () => {
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner");

    test.each([undefined, null, 0, -1])(
      "is unsatisfied if Monat has Bruttoeinkommen set to %s",
      (bruttoeinkommen) => {
        const monat = { bruttoeinkommen, imMutterschutz: false as const };

        expect(MonatHatBruttoeinkommen.asPredicate(monat)).toBe(false);
      },
    );

    test.each([1, 2, 3629])(
      "is satisfied if Monat has Bruttoeinkommen set to %s",
      (bruttoeinkommen) => {
        const monat = { bruttoeinkommen, imMutterschutz: false as const };

        expect(MonatHatBruttoeinkommen.asPredicate(monat)).toBe(true);
      },
    );

    it("is unsatisfied for a Monat im Mutterschutz", () => {
      expect(MonatHatBruttoeinkommen.asPredicate(MONAT_MIT_MUTTERSCHUTZ)).toBe(
        false,
      );
    });
  });
}
