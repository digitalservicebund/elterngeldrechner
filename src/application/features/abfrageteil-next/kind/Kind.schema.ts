import * as z from "zod";

export const GeburtSchema = z.object({ istGeboren: z.boolean() });

export const UngeborenesKindSchema = z.object({
  errechneterEntbindungstermin: z.date(),
  anzahl: z.number().min(1),
});

export const GeborenesKindSchema = z.object({
  geburtsdatum: z.date(),
  anzahl: z.number().min(1),
});

export const KindSchema = z.xor([UngeborenesKindSchema, GeborenesKindSchema]);

export type Geburt = z.infer<typeof GeburtSchema>;

export type UngeborenesKind = z.infer<typeof UngeborenesKindSchema>;

export type GeborenesKind = z.infer<typeof GeborenesKindSchema>;

export type Kind = z.infer<typeof KindSchema>;

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

    it("is invalid if istGeboren is absent", () => {
      expect({}).not.toEqual(expect.schemaMatching(GeburtSchema));
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
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if anzahl is missing", () => {
      expect({
        errechneterEntbindungstermin: new Date(
          Date.parse("2025-01-26T00:00:00Z"),
        ),
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
    });

    it("is invalid if errechneterEntbindungstermin is missing", () => {
      expect({
        anzahl: 1,
      }).not.toEqual(expect.schemaMatching(UngeborenesKindSchema));
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
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if anzahl is missing", () => {
      expect({
        geburtsdatum: new Date(Date.parse("2025-01-26T00:00:00Z")),
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
    });

    it("is invalid if geburtsdatum is missing", () => {
      expect({
        anzahl: 1,
      }).not.toEqual(expect.schemaMatching(GeborenesKindSchema));
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
