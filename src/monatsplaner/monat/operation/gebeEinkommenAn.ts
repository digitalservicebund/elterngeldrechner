import type { Monat } from "@/monatsplaner/monat/Monat";

export function gebeEinkommenAn(monat: Monat, bruttoeinkommen: number): Monat {
  if (monat.imMutterschutz) {
    return monat;
  } else if ([0, NaN].includes(bruttoeinkommen)) {
    return { ...monat, bruttoeinkommen: undefined };
  } else {
    return { ...monat, bruttoeinkommen };
  }
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("gebe Einkommen für Monat an", async () => {
    const { MONAT_MIT_MUTTERSCHUTZ } = await import("@/monatsplaner/monat");

    it("keeps the Monat untouched if it is a Monat im Mutterschutz", () => {
      const monat = gebeEinkommenAn(MONAT_MIT_MUTTERSCHUTZ, 100);

      expect(monat).toStrictEqual(MONAT_MIT_MUTTERSCHUTZ);
    });

    it.each([0, NaN])(
      "unsets the Bruttoneinkommen when given a value of %s",
      (bruttoeinkommen) => {
        const monat = gebeEinkommenAn(
          {
            bruttoeinkommen: 100,
            imMutterschutz: false as const,
          },
          bruttoeinkommen,
        );

        expect(monat.bruttoeinkommen).toBeUndefined();
      },
    );

    it("just sets the Bruttoeinkommen value if greater than zero", () => {
      const monat = gebeEinkommenAn({ imMutterschutz: false as const }, 100);

      expect(monat.bruttoeinkommen).toBe(100);
    });
  });
}
