import * as z from "zod";

export const GeburtSchema = z.object({ istGeboren: z.boolean().optional() });

export const UngeborenesKindSchema = z.object({
  errechneterEntbindungstermin: z.date().optional(),
  anzahl: z.number().min(1).optional(),
});

export const GeborenesKindSchema = z.object({
  geburtsdatum: z.date().optional(),
  anzahl: z.number().min(1).optional(),
});

export const KindSchema = z.xor([UngeborenesKindSchema, GeborenesKindSchema]);

export type Geburt = Required<z.infer<typeof GeburtSchema>>;

export type UngeborenesKind = Required<z.infer<typeof UngeborenesKindSchema>>;

export type GeborenesKind = Required<z.infer<typeof GeborenesKindSchema>>;

export type Kind = Required<z.infer<typeof KindSchema>>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("GeburtSchema", () => {
    it("is valid if istGeboren is true", () => {
      expect({
        istGeboren: true,
      }).toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is valid if istGeboren is false", () => {
      expect({
        istGeboren: false,
      }).toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is valid if istGeboren is absent", () => {
      expect({}).toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is a string instead of a boolean", () => {
      expect({
        istGeboren: "true",
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });

    it("is invalid if istGeboren is null", () => {
      expect({
        istGeboren: null,
      }).not.toEqual(expect.schemaMatching(GeburtSchema));
    });
  });

  describe("UngeborenesKindSchema", () => {
    it("is valid if anzahl is positive and errechneterEntbindungstermin is a Date object", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: new Date(
          Date.parse("2025-01-26T00:00:00Z"),
        ),
      }).toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if the anzahl is negative", () => {
      expect({
        anzahl: -1,
        errechneterEntbindungstermin: new Date(
          Date.parse("2025-01-26T00:00:00Z"),
        ),
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema.required()));
    });

    it("is invalid if errechneterEntbindungstermin is a string instead of a Date", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: "2025-02-15",
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is a timestamp number instead of a Date", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: Date.parse("2025-02-15T00:00:00Z"),
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is an invalid Date object", () => {
      expect({
        anzahl: 1,
        errechneterEntbindungstermin: new Date("invalid"),
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
    it("is valid if anzahl is positive and geburtsdatum is a Date object", () => {
      const kind: GeborenesKind = {
        anzahl: 1,
        geburtsdatum: new Date(Date.parse("2025-01-26T00:00:00Z")),
      };

      expect(kind).toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if the anzahl is negative", () => {
      expect({
        anzahl: -1,
        geburtsdatum: new Date(Date.parse("2025-01-26T00:00:00Z")),
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema.required()));
    });

    it("is invalid if geburtsdatum is a string instead of a Date", () => {
      expect({
        anzahl: 1,
        geburtsdatum: "2025-01-26",
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is a timestamp number instead of a Date", () => {
      expect({
        anzahl: 1,
        geburtsdatum: Date.parse("2025-01-26T00:00:00Z"),
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is an invalid Date object", () => {
      expect({
        anzahl: 1,
        geburtsdatum: new Date("invalid"),
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is null", () => {
      expect({
        anzahl: 1,
        geburtsdatum: null,
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });
  });
}
