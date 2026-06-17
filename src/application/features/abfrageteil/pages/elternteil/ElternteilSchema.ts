import { Temporal } from "@js-temporal/polyfill";
import { z } from "zod";
import { ElternteilAusklammerungszeitenInput } from "./ElternteilAusklammerungZeitenPage";
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

export const ElternteilAusklammerungGruendeSchema = z
  .object({
    hatKeineAusklammerungsgruende: z.boolean(),
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
  )
  .refine(
    (data) => {
      if (data.hatKeineAusklammerungsgruende) {
        return !(
          data.hatMutterschutzAelteresKind ||
          data.hatElterngeldAelteresKind ||
          data.hatSchwangerschaftsbedingteErkrankung
        );
      }
      return true;
    },
    {
      message:
        "Widersprüchliche Auswahl: 'Keine Gründe' darf nicht mit anderen Optionen kombiniert werden.",
      path: ["hatKeineAusklammerungsgruende"],
    },
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
