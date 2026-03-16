import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";
import { ElternteilAusklammerungszeitenInput } from "./ElternteilAusklammerungZeitenPage";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil-next/zod";
import { OptionalBooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/zod/codecs/OptionalBooleanRadiobuttonCodec";

export const ElternteilAllgemeineAngabenSchema = z.object({
  name: z.string().min(1, "Der Name darf nicht leer sein"),
  istAlleinerziehend: BooleanRadiobuttonCodec,
  istImMutterschutz: OptionalBooleanRadiobuttonCodec,
});

export type ElternteilAllgemeineAngaben = z.infer<
  typeof ElternteilAllgemeineAngabenSchema
>;

const AusklammerungGruendeSchema = z
  .object({
    hatMutterschutzAelteresKind: z.boolean(),
    hatElterngeldAelteresKind: z.boolean(),
    hatSchwangerschaftsbedingteErkrankung: z.boolean(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((value) => value === true);
    },
    {
      message: "Bitte treffen Sie eine Auswahl.",
      path: ["hatKeineAusklammerungsgruende"],
    },
  );

export const ElternteilAusklammerungGruendeSchema = z.discriminatedUnion(
  "hatKeineAusklammerungsgruende",
  [
    z.object({ hatKeineAusklammerungsgruende: z.literal(true) }),
    AusklammerungGruendeSchema.extend({
      hatKeineAusklammerungsgruende: z.literal(false),
    }),
  ],
);

export type ElternteilAusklammerungGruende = z.infer<
  typeof ElternteilAusklammerungGruendeSchema
>;

// TODO: Make illegal state not representable between schemas hatSchwangerschaftsbedingteErkrankung: true and erkrankung.length > 0

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

export const ElternteilAusklammerungZeitenSchema = z.object({
  mutterschutzGeschwisterkind: z.array(Zeitspanne),
  elterngeldGeschwisterkind: z.array(Zeitspanne),
  erkrankungSchwangerschaft: z.array(Zeitspanne),
});

export type ElternteilAusklammerungZeiten = z.infer<
  typeof ElternteilAusklammerungZeitenSchema
>;

const TaetigkeitenSchema = z
  .object({
    istNichtSelbststaendig: z.boolean(),
    istSelbststaendig: z.boolean(),
    istVerbeamtet: z.boolean(),
    hatAndereLeistungen: z.boolean(),
  })
  .refine(
    (data) => {
      return Object.values(data).some((value) => value === true);
    },
    {
      message: "Bitte treffen Sie eine Auswahl.",
      path: ["hatKeinEinkommen"],
    },
  );

export const taetigkeitenFelder = Object.keys(
  TaetigkeitenSchema.def.shape,
) as Array<keyof z.infer<typeof TaetigkeitenSchema>>;

export const ElternteilTaetigkeitenAbfrageSchema = z.discriminatedUnion(
  "hatKeinEinkommen",
  [
    z.object({
      hatKeinEinkommen: z.literal(true),
    }),
    TaetigkeitenSchema.extend({
      hatKeinEinkommen: z.literal(false),
    }),
  ],
);

export type ElternteilTaetigkeitenAbfrage = z.infer<
  typeof ElternteilTaetigkeitenAbfrageSchema
>;

export const ElternteilZweitePersonAngabenSchema = z
  .object({
    wirdZweitePersonBeruecksichtigt: OptionalBooleanRadiobuttonCodec,
    name: z.string().optional(),
    istImMutterschutz: OptionalBooleanRadiobuttonCodec,
  })
  .refine(
    (data) => {
      if (data.wirdZweitePersonBeruecksichtigt !== false) {
        return !!data.name && data.name.trim().length > 0;
      }
      return true;
    },
    {
      message: "Bitte geben Sie einen Namen an.",
      path: ["name"],
    },
  );

export type ElternteilZweitePersonAngaben = z.infer<
  typeof ElternteilZweitePersonAngabenSchema
>;

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("ElternteilTaetigkeitenAbfrageSchema", () => {
    const schema = ElternteilTaetigkeitenAbfrageSchema;

    it("accepts hatKeinEinkommen: true alone", () => {
      const result = schema.safeParse({ hatKeinEinkommen: true });

      expect(result.success).toBeTruthy();
    });

    it("rejects hatKeinEinkommen: false with no other field selected", () => {
      const result = schema.safeParse({
        hatKeinEinkommen: false,
        istNichtSelbststaendig: false,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });

      expect(result.success).toBeFalsy();

      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({
          code: "custom",
          path: ["hatKeinEinkommen"],
          message: "Bitte treffen Sie eine Auswahl.",
        });
      }
    });

    it("accepts hatKeinEinkommen: false with at least one other field selected", () => {
      const result = schema.safeParse({
        hatKeinEinkommen: false,
        istNichtSelbststaendig: true,
        istSelbststaendig: false,
        istVerbeamtet: false,
        hatAndereLeistungen: false,
      });

      expect(result.success).toBeTruthy();
    });
  });

  describe("ElternteilAusklammerungsZeiten", () => {
    const schema = ElternteilAusklammerungZeitenSchema;

    it("rejects mutterschutzGeschwisterkind if von > bis", () => {
      const ausklammerungszeiten: ElternteilAusklammerungszeitenInput = {
        mutterschutzGeschwisterkind: [
          {
            von: "04.01.2025",
            bis: "01.01.2025",
          },
        ],
        elterngeldGeschwisterkind: [
          {
            von: "01.04.2025",
            bis: "01.05.2025",
          },
        ],
        erkrankungSchwangerschaft: [
          {
            von: "01.06.2025",
            bis: "01.07.2025",
          },
        ],
      };

      const result = schema.safeParse(ausklammerungszeiten);

      expect(result.success).toBeFalsy();

      if (!result.success) {
        expect(result.error.issues[0]).toMatchObject({
          code: "custom",
          path: ["mutterschutzGeschwisterkind", 0, "von"],
          message: "Der Start einer Ausklammerung muss vor dem Ende liegen.",
        });
      }
    });

    it("accepts mutterschutzGeschwisterkind if von === bis", () => {
      const ausklammerungszeiten: ElternteilAusklammerungszeitenInput = {
        mutterschutzGeschwisterkind: [
          {
            von: "01.01.2025",
            bis: "01.01.2025",
          },
        ],
        elterngeldGeschwisterkind: [
          {
            von: "01.04.2025",
            bis: "01.05.2025",
          },
        ],
        erkrankungSchwangerschaft: [
          {
            von: "01.06.2025",
            bis: "01.07.2025",
          },
        ],
      };

      const result = schema.safeParse(ausklammerungszeiten);

      expect(result.success).toBeTruthy();
    });

    it("accepts mutterschutzGeschwisterkind if von < bis", () => {
      const ausklammerungszeiten: ElternteilAusklammerungszeitenInput = {
        mutterschutzGeschwisterkind: [
          {
            von: "01.01.2025",
            bis: "01.02.2025",
          },
        ],
        elterngeldGeschwisterkind: [
          {
            von: "01.04.2025",
            bis: "01.05.2025",
          },
        ],
        erkrankungSchwangerschaft: [
          {
            von: "01.06.2025",
            bis: "01.07.2025",
          },
        ],
      };

      const result = schema.safeParse(ausklammerungszeiten);

      expect(result.success).toBeTruthy();
    });
  });
}
