import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil-next/zod";

const VorhandenesGeschwisterkind = z.object({
  istVorhanden: z.literal("yes"),
  geburtsdatum: GermanDateInputCodec,
  hatBehinderung: BooleanRadiobuttonCodec,
});

const KeinGeschwisterkind = z.object({
  istVorhanden: z.literal("no"),
});

export const GeschwisterkindSchema = z.discriminatedUnion("istVorhanden", [
  VorhandenesGeschwisterkind,
  KeinGeschwisterkind,
]);

export const GeschwisterSchema = z
  .array(GeschwisterkindSchema)
  .superRefine((val, ctx) => {
    const firstNoIndex = val.findIndex((item) => item.istVorhanden === "no");

    if (firstNoIndex === -1) return;

    const lastNoIndex = val.findLastIndex((item) => item.istVorhanden === "no");

    if (firstNoIndex !== lastNoIndex) {
      ctx.addIssue({
        code: "custom",
        message: "Es darf nur eine Auswahl 'Nein' geben.",
        path: [lastNoIndex],
      });
    }

    if (firstNoIndex !== val.length - 1) {
      ctx.addIssue({
        code: "custom",
        message: "Nach einem 'Nein' dürfen keine weiteren Einträge folgen.",
        path: [firstNoIndex],
      });
    }
  });

export type Geschwister = z.infer<typeof GeschwisterSchema>;

export type Geschwisterkind = z.infer<typeof GeschwisterkindSchema>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("GeschwisterSchema", () => {
    it("is valid if istVorhanden is 'no'", () => {
      expect([
        {
          istVorhanden: "no",
        },
      ]).toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is 'yes' but 'geburtsdatum' and 'hatBehinderung' are missing", () => {
      expect([
        {
          istVorhanden: "yes",
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is valid if istVorhanden is 'yes' and 'geburtsdatum' and 'hatBehinderung' are included", () => {
      expect([
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2025",
          hatBehinderung: "yes",
        },
      ]).toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is absent", () => {
      expect([{}]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is valid if several Geschwister are included", () => {
      expect([
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2024",
          hatBehinderung: "yes",
        },
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2025",
          hatBehinderung: "yes",
        },
      ]).toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is valid if array ends with istVorhanden 'no'", () => {
      expect([
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2024",
          hatBehinderung: "yes",
        },
        {
          istVorhanden: "no",
        },
      ]).toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden 'no' is not the last item in array", () => {
      expect([
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2024",
          hatBehinderung: "yes",
        },
        {
          istVorhanden: "no",
        },
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2025",
          hatBehinderung: "yes",
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if several istVorhanden 'no' are included in array", () => {
      expect([
        {
          istVorhanden: "yes",
          geburtsdatum: "28.01.2024",
          hatBehinderung: "yes",
        },
        {
          istVorhanden: "no",
        },
        {
          istVorhanden: "no",
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is boolean true", () => {
      expect([
        {
          istVorhanden: true,
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is boolean false", () => {
      expect([
        {
          istVorhanden: false,
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is an arbitrary string", () => {
      expect([
        {
          istVorhanden: "maybe",
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });

    it("is invalid if istVorhanden is null", () => {
      expect([
        {
          istVorhanden: null,
        },
      ]).not.toEqual(expect.schemaMatching(GeschwisterSchema));
    });
  });

  describe("VorhandenesGeschwisterkindSchema", () => {
    it("is valid with German date format DD.MM.YYYY", () => {
      expect({
        istVorhanden: "yes",
        geburtsdatum: "26.01.2025",
        hatBehinderung: "no",
      }).toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if istVorhanden is 'no'", () => {
      expect({
        istVorhanden: "no",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if istVorhanden is missing", () => {
      expect({
        geburtsdatum: "26.01.2025",
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if geburtsdatum is missing", () => {
      expect({
        istVorhanden: "yes",
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if hatBehinderung is missing", () => {
      expect({
        istVorhanden: "yes",
        geburtsdatum: "26.01.2025",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if geburtsdatum is an empty string", () => {
      expect({
        istVorhanden: "yes",
        geburtsdatum: "",
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });

    it("is invalid if errechneterEntbindungstermin has wrong format", () => {
      expect({
        istVorhanden: "yes",
        geburtsdatum: "2025-01-20",
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(VorhandenesGeschwisterkind));
    });
  });
}
