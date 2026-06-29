import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil/zod";

export const GeschwisterkindAbfrageSchema = z.object({
  istVorhanden: BooleanRadiobuttonCodec,
});

export const GeschwisterkindAnzahlAbfrageSchema = z.object({
  anzahlGeschwisterkinder: z.coerce
    .number({ error: "Invalide Eingabe" })
    .min(1, "Mindestens 1 Geschwisterkind"),
});

export const GeschwisterkindAngabenSchema = z.object({
  geburtsdatum: GermanDateInputCodec,
  hatBehinderung: BooleanRadiobuttonCodec,
});

export type GeschwisterkindAbfrage = z.infer<
  typeof GeschwisterkindAbfrageSchema
>;

export type GeschwisterkindAnzahlAbfrage = z.infer<
  typeof GeschwisterkindAnzahlAbfrageSchema
>;

export type GeschwisterkindAngaben = z.infer<
  typeof GeschwisterkindAngabenSchema
>;

export function erstelleGeschwisterkindAngabenSchema(
  kindGeburtsdatum: Temporal.PlainDate,
) {
  return GeschwisterkindAngabenSchema.superRefine(({ geburtsdatum }, ctx) => {
    if (!(geburtsdatum instanceof Temporal.PlainDate)) return;
    if (Temporal.PlainDate.compare(geburtsdatum, kindGeburtsdatum) >= 0) {
      ctx.addIssue({
        code: "custom",
        message:
          "Das Geburtsdatum des Geschwisterkindes muss vor dem Geburtsdatum des Kindes liegen, für das Elterngeld beantragt werden soll.",
        path: ["geburtsdatum"],
      });
    }
  });
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("GeschwisterkindAbfrageSchema", () => {
    it("is valid if istVorhanden is 'yes'", () => {
      expect({
        istVorhanden: "yes",
      }).toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });

    it("is valid if istVorhanden is 'no'", () => {
      expect({
        istVorhanden: "no",
      }).toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });

    it("is invalid if istVorhanden is absent", () => {
      expect({}).not.toEqual(
        expect.schemaMatching(GeschwisterkindAbfrageSchema),
      );
    });

    it("is invalid if istVorhanden is boolean true", () => {
      expect({
        istVorhanden: true,
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });

    it("is invalid if istVorhanden is boolean false", () => {
      expect({
        istVorhanden: false,
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });

    it("is invalid if istVorhanden is an arbitrary string", () => {
      expect({
        istVorhanden: "maybe",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });

    it("is invalid if istVorhanden is null", () => {
      expect({
        istVorhanden: null,
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAbfrageSchema));
    });
  });

  describe("GeschwisterkindAngabenSchema", () => {
    it("is valid if all required fields are included", () => {
      expect({
        geburtsdatum: "10.02.2026",
        hatBehinderung: "no",
      }).toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });

    it("is invalid if geburtsdatum is missing", () => {
      expect({
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });

    it("is invalid if hatBehinderung is missing", () => {
      expect({
        geburtsdatum: "10.02.2026",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });
  });

  describe("erstelleGeschwisterkindAngabenSchema", () => {
    const schema = erstelleGeschwisterkindAngabenSchema(
      Temporal.PlainDate.from("2025-06-01"),
    );

    it("accepts a sibling birthdate strictly before the child's birthdate", () => {
      const result = schema.safeParse({
        geburtsdatum: "31.05.2025",
        hatBehinderung: "no",
      });

      expect(result.success).toBeTruthy();
    });

    it("rejects a sibling birthdate equal to the child's birthdate", () => {
      const result = schema.safeParse({
        geburtsdatum: "01.06.2025",
        hatBehinderung: "no",
      });

      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues[0];
        expect(issue).toMatchObject({ code: "custom", path: ["geburtsdatum"] });
        expect(issue?.message).toContain("muss vor dem Geburtsdatum");
      }
    });

    it("rejects a sibling birthdate after the child's birthdate", () => {
      const result = schema.safeParse({
        geburtsdatum: "15.07.2025",
        hatBehinderung: "no",
      });

      expect(result.success).toBeFalsy();
      if (!result.success) {
        const issue = result.error.issues[0];
        expect(issue).toMatchObject({ code: "custom", path: ["geburtsdatum"] });
        expect(issue?.message).toContain("muss vor dem Geburtsdatum");
      }
    });

    it("skips the date comparison when geburtsdatum is not a valid date string", () => {
      const result = schema.safeParse({
        geburtsdatum: "kein-datum",
        hatBehinderung: "no",
      });

      expect(result.success).toBeFalsy();
      if (!result.success) {
        const hasDateComparisonError = result.error.issues.some((issue) =>
          issue.message.includes("muss vor dem Geburtsdatum"),
        );
        expect(hasDateComparisonError).toBeFalsy();
      }
    });
  });
}
