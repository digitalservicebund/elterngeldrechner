import * as z from "zod";

export const bundeslaender = [
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

export const AllgemeineAngabenSchema = z.object({
  bundesland: z.enum(bundeslaender, {
    error: "Bitte wählen Sie ein Bundesland.",
  }),
  gesamteinkommenGrenzeUeberschritten: z.union([
    z.boolean(),
    z.stringbool({
      truthy: ["true"],
      falsy: ["false"],
      error: "Wählen Sie bitte Ja oder Nein",
    }),
  ]),
});

export type AllgemeineAngaben = z.infer<typeof AllgemeineAngabenSchema>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("AllgemeineAngabenSchema", () => {
    it("rejects when all values are absent", () => {
      const allgemeineAngaben = {};

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects when only bundesland is provided", () => {
      const allgemeineAngaben = {
        bundesland: "Berlin",
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects an invalid bundesland", () => {
      const allgemeineAngaben = {
        bundesland: "InvalidState",
        gesamteinkommenGrenzeUeberschritten: true,
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects when only gesamteinkommenGrenzeUeberschritten is provided", () => {
      const allgemeineAngaben = {
        gesamteinkommenGrenzeUeberschritten: true,
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects non-boolean value for gesamteinkommenGrenzeUeberschritten", () => {
      const allgemeineAngaben = {
        bundesland: "Berlin",
        gesamteinkommenGrenzeUeberschritten: "yes",
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts a complete valid object with boolean true", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: true,
      };

      expect(allgemeineAngaben).toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts a complete valid object with boolean false", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: false,
      };

      expect(allgemeineAngaben).toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    // Html radio inputs always submit string values, so we need to convert
    // the "true" and "false" strings to actual booleans before validation.
    it("accepts a complete valid object with string 'true'", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: "true",
      };

      expect(allgemeineAngaben).toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    // Html radio inputs always submit string values, so we need to convert
    // the "true" and "false" strings to actual booleans before validation.
    it("accepts a complete valid object with string 'false'", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: "false",
      };

      expect(allgemeineAngaben).toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
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
        expect({
          bundesland,
          gesamteinkommenGrenzeUeberschritten: true,
        }).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
      }
    });
  });
}
