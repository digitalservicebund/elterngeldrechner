import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil/zod";
import { OptionalBooleanRadiobuttonCodec } from "@/application/features/abfrageteil/zod/codecs/OptionalBooleanRadiobuttonCodec";

export const ElternteilEinsAllgemeineAngabenSchema = z.object({
  name: z.string().min(1, "Der Name darf nicht leer sein"),
  istAlleinerziehend: BooleanRadiobuttonCodec,
  istImMutterschutz: BooleanRadiobuttonCodec,
});

export type ElternteilEinsAllgemeineAngaben = z.infer<
  typeof ElternteilEinsAllgemeineAngabenSchema
>;

export const ElternteilGemeinsamePlanungAbfrageSchema = z.object({
  wirdZweitePersonBeruecksichtigt: OptionalBooleanRadiobuttonCodec,
});

export type ElternteilGemeinsamePlanungAbfrage = z.infer<
  typeof ElternteilGemeinsamePlanungAbfrageSchema
>;

export const ElternteilZweiAllgemeineAngabenSchema = z
  .object({
    name: z.string(),
    istImMutterschutz: BooleanRadiobuttonCodec.optional(),
  })
  .refine(
    (data) => {
      return data.istImMutterschutz !== undefined;
    },
    {
      message: "Wählen Sie bitte Ja oder Nein",
      path: ["istImMutterschutz"],
    },
  );

export type ElternteilZweiAllgemeineAngaben = z.infer<
  typeof ElternteilZweiAllgemeineAngabenSchema
>;

export const ElternteilAusklammerungErkrankungAbfrageSchema = z.object({
  hatSchwangerschaftsbedingteErkrankung: OptionalBooleanRadiobuttonCodec,
});

export type ElternteilAusklammerungErkrankungAbfrage = z.infer<
  typeof ElternteilAusklammerungErkrankungAbfrageSchema
>;

export const ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema =
  z.object({
    hatElterngeldGeschwisterkind: OptionalBooleanRadiobuttonCodec,
  });

export type ElternteilAusklammerungElternzeitGeschwisterkindAbfrage = z.infer<
  typeof ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema
>;

export const ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema =
  z.object({
    hatMutterschutzGeschwisterkind: OptionalBooleanRadiobuttonCodec,
  });

export type ElternteilAusklammerungMutterschutzGeschwisterkindAbfrage = z.infer<
  typeof ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema
>;

const Zeitspanne = z
  .object({
    von: GermanDateInputCodec,
    bis: GermanDateInputCodec,
  })
  .superRefine(({ von, bis }, context) => {
    if (!(von instanceof Temporal.PlainDate)) return;
    if (!(bis instanceof Temporal.PlainDate)) return;

    if (Temporal.PlainDate.compare(von, bis) === 1) {
      context.addIssue({
        code: "custom",
        message: "Der Start einer Ausklammerung muss vor dem Ende liegen.",
        path: ["von"],
      });
    }
  });

export const ElternteilAusklammerungErkrankungZeitenSchema = z.object({
  erkrankungSchwangerschaft: z.array(Zeitspanne),
});

export type ElternteilAusklammerungErkrankungZeiten = z.infer<
  typeof ElternteilAusklammerungErkrankungZeitenSchema
>;

export const ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema =
  z.object({
    elterngeldGeschwisterkind: z.array(Zeitspanne),
  });

export type ElternteilAusklammerungElterngeldGeschwisterkindZeiten = z.infer<
  typeof ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema
>;

export const ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema =
  z.object({
    mutterschutzGeschwisterkind: Zeitspanne,
  });

export type ElternteilAusklammerungMutterschutzGeschwisterkindZeiten = z.infer<
  typeof ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema
>;

export const ElternteilTaetigkeitenAbfrageSchema = z
  .object({
    istNichtSelbststaendig: z.boolean(),
    istSelbststaendig: z.boolean(),
    istVerbeamtet: z.boolean(),
    hatAndereLeistungen: z.boolean(),
    hatPeriodenOhneEinkommen: z.boolean(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((value) => value === true);
    },
    {
      message: "Bitte treffen Sie eine Auswahl.",
      path: ["hatPeriodenOhneEinkommen"],
    },
  );

export type ElternteilTaetigkeitenAbfrage = z.infer<
  typeof ElternteilTaetigkeitenAbfrageSchema
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ElternteilZweiAllgemeineAngabenSchema", () => {
    it("rejects when istImMutterschutz is missing", () => {
      const result = ElternteilZweiAllgemeineAngabenSchema.safeParse({
        name: "Anna",
      });

      expect(result.success).toBeFalsy();

      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({
          path: ["istImMutterschutz"],
        });
      }
    });

    it("accepts when Person 2 is considered and istImMutterschutz is provided", () => {
      const result = ElternteilZweiAllgemeineAngabenSchema.safeParse({
        name: "Anna",
        istImMutterschutz: "no",
      });

      expect(result.success).toBeTruthy();
    });
  });

  describe("ElternteilTaetigkeitenAbfrageSchema", () => {
    const schema = ElternteilTaetigkeitenAbfrageSchema;

    it("rejects hatPeriodenOhneEinkommen: true alone", () => {
      const result = schema.safeParse({ hatPeriodenOhneEinkommen: true });

      expect(result.success).toBeFalsy();
    });

    it("rejects hatPeriodenOhneEinkommen: false with no other field selected", () => {
      const result = schema.safeParse({
        hatPeriodenOhneEinkommen: false,
        istNichtSelbststaendig: false,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });

      expect(result.success).toBeFalsy();

      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({
          code: "custom",
          path: ["hatPeriodenOhneEinkommen"],
          message: "Bitte treffen Sie eine Auswahl.",
        });
      }
    });

    it("accepts hatPeriodenOhneEinkommen: false with at least one other field selected", () => {
      const result = schema.safeParse({
        hatPeriodenOhneEinkommen: false,
        istNichtSelbststaendig: true,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });

      expect(result.success).toBeTruthy();
    });
  });
}
