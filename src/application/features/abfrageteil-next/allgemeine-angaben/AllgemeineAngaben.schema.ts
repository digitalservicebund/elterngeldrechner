import { z } from "zod";

import { BooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/schema";

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
  gesamteinkommenGrenzeUeberschritten: BooleanRadiobuttonCodec,
});

export type AllgemeineAngaben = z.infer<typeof AllgemeineAngabenSchema>;

export type AllgemeineAngabenInput = z.input<typeof AllgemeineAngabenSchema>;

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
        gesamteinkommenGrenzeUeberschritten: "yes",
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects when only gesamteinkommenGrenzeUeberschritten is provided", () => {
      const allgemeineAngaben = {
        gesamteinkommenGrenzeUeberschritten: "yes",
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("rejects invalid value for gesamteinkommenGrenzeUeberschritten", () => {
      const allgemeineAngaben = {
        bundesland: "Berlin",
        gesamteinkommenGrenzeUeberschritten: "maybe",
      };

      expect(allgemeineAngaben).not.toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts a complete valid object with 'yes'", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: "yes",
      };

      expect(allgemeineAngaben).toEqual(
        expect.schemaMatching(AllgemeineAngabenSchema),
      );
    });

    it("accepts a complete valid object with 'no'", () => {
      const allgemeineAngaben = {
        bundesland: "Bayern",
        gesamteinkommenGrenzeUeberschritten: "no",
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
          gesamteinkommenGrenzeUeberschritten: "yes",
        }).toEqual(expect.schemaMatching(AllgemeineAngabenSchema));
      }
    });
  });
}
