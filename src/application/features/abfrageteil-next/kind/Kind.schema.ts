import * as z from "zod";
import {
  BooleanRadiobuttonSchema,
  GermanDateinputSchema,
} from "@/application/features/abfrageteil-next/common-schemas";

export const GeburtSchema = z.object({
  istGeboren: BooleanRadiobuttonSchema,
});

export const UngeborenesKindSchema = z.object({
  errechneterEntbindungstermin: GermanDateinputSchema,
  anzahl: z.number().min(1),
});

export const GeborenesKindSchema = z.object({
  geburtsdatum: GermanDateinputSchema,
  errechneterEntbindungstermin: GermanDateinputSchema,
  anzahl: z.number().min(1),
});

export const KindSchema = z.xor([UngeborenesKindSchema, GeborenesKindSchema]);

export type Geburt = z.infer<typeof GeburtSchema>;

export type UngeborenesKind = z.infer<typeof UngeborenesKindSchema>;

export type GeborenesKind = z.infer<typeof GeborenesKindSchema>;

export type Kind = z.infer<typeof KindSchema>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("", () => {
    it("is valid if istGeboren is 'yes'", () => {
      expect({
        istGeboren: "yes",
      }).toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is valid if istGeboren is 'no'", () => {
      expect({
        istGeboren: "no",
      }).toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is absent", () => {
      expect({}).not.toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is boolean true", () => {
      expect({
        istGeboren: true,
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is boolean false", () => {
      expect({
        istGeboren: false,
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is an arbitrary string", () => {
      expect({
        istGeboren: "maybe",
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is null", () => {
      expect({
        istGeboren: null,
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });
  });

  describe("UngeborenesKindSchema", () => {
    it("is valid with German date format DD.MM.YYYY", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "26.01.2025",
      }).toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if the anzahl is negative", () => {
      expect({
        anzahl: -1,
        errechneterEntbindungstermin: "26.01.2025",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if anzahl is missing", () => {
      expect({
        errechneterEntbindungstermin: "26.01.2025",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is missing", () => {
      expect({
        anzahl: 1,
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is an empty string", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin has wrong format", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "2025-01-26",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is a partial input", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "11",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is null", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: null,
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });
  });

  describe("GeborenesKindSchema", () => {
    it("is valid with German date format DD.MM.YYYY", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: "20.01.2025",
      }).toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if the anzahl is negative", () => {
      expect({
        anzahl: -1,
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if anzahl is missing", () => {
      expect({
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is missing", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is missing", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "26.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is an empty string", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "",
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is an empty string", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: "",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum has wrong format", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "2025-01-26",
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin has wrong format", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: "2025-01-20",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is null", () => {
      expect({
        anzahl: 1,
        geburtsdatum: null,
        errechneterEntbindungstermin: "20.01.2025",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is null", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "26.01.2025",
        errechneterEntbindungstermin: null,
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });
  });
}
