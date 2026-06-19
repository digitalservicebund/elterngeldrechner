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
}
