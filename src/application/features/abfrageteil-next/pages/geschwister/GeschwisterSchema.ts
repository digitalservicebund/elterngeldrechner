import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil-next/zod";

export const GeschwisterkindAbfrageSchema = z.object({
  istVorhanden: BooleanRadiobuttonCodec,
});

export const GeschwisterkindAngabenSchema = z.object({
  geburtsdatum: GermanDateInputCodec,
  hatBehinderung: BooleanRadiobuttonCodec,
  istWeiteresGeschwisterkindVorhanden: BooleanRadiobuttonCodec,
});

export type GeschwisterkindAbfrage = z.infer<
  typeof GeschwisterkindAbfrageSchema
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
        istWeiteresGeschwisterkindVorhanden: "no",
      }).toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });

    it("is invalid if geburtsdatum is missing", () => {
      expect({
        hatBehinderung: "no",
        istWeiteresGeschwisterkindVorhanden: "no",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });

    it("is invalid if hatBehinderung is missing", () => {
      expect({
        geburtsdatum: "10.02.2026",
        istWeiteresGeschwisterkindVorhanden: "no",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });

    it("is invalid if istWeiteresGeschwisterkindVorhanden is missing", () => {
      expect({
        geburtsdatum: "10.02.2026",
        hatBehinderung: "no",
      }).not.toEqual(expect.schemaMatching(GeschwisterkindAngabenSchema));
    });
  });
}
