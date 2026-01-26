import * as z from "zod";

const Bundesland = z.enum([
  "Baden-Württemberg",
  "Bayern",
  "Berlin",
  "Brandenburg",
  "Bremen",
  "Hamburg",
  "Hessen",
  "Mecklenburg-Vorpommern",
  "Niedersachsen",
  "Nordrhein-Westfalen",
  "Rheinland-Pfalz",
  "Saarland",
  "Sachsen",
  "Sachsen-Anhalt",
  "Schleswig-Holstein",
  "Thüringen",
]);

export const AllgemeineAngabenSchema = z.object({
  bundesland: Bundesland.optional(),
  gesamteinkommenGrenzeUeberschritten: z.boolean().optional(),
});

export type AllgemeineAngaben = Required<
  z.infer<typeof AllgemeineAngabenSchema>
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("AllgemeineAngabenSchema", () => {
    it("allows all values to be absent", () => {
      const familie = {};

      expect(familie).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
    });

    it("accepts a valid bundesland", () => {
      const familie = {
        bundesland: "Berlin",
      };

      expect(familie).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
    });

    it("accepts all valid bundesland values", () => {
      const bundeslaender = [
        "Baden-Württemberg",
        "Bayern",
        "Berlin",
        "Brandenburg",
        "Bremen",
        "Hamburg",
        "Hessen",
        "Mecklenburg-Vorpommern",
        "Niedersachsen",
        "Nordrhein-Westfalen",
        "Rheinland-Pfalz",
        "Saarland",
        "Sachsen",
        "Sachsen-Anhalt",
        "Schleswig-Holstein",
        "Thüringen",
      ];

      for (const bundesland of bundeslaender) {
        expect({ bundesland }).toEqual(
          expect.schemaMatching(AllgemeineAngabenSchema),
        );
      }
    });

    it("rejects an invalid bundesland", () => {
      const familie = {
        bundesland: "InvalidState",
      };

      expect(familie).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts gesamteinkommenGrenzeUeberschritten as true", () => {
      const familie = {
        gesamteinkommenGrenzeUeberschritten: true,
      };

      expect(familie).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
    });

    it("accepts gesamteinkommenGrenzeUeberschritten as false", () => {
      const familie = {
        gesamteinkommenGrenzeUeberschritten: false,
      };

      expect(familie).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
    });

    it("rejects non-boolean value for gesamteinkommenGrenzeUeberschritten", () => {
      const familie = {
        gesamteinkommenGrenzeUeberschritten: "yes",
      };

      expect(familie).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts a complete valid object", () => {
      const familie = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: false,
      };

      expect(familie).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
    });
  });
}
