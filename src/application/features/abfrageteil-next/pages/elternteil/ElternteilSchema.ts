import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil-next/zod";
import { OptionalBooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/zod/codecs/OptionalBooleanRadiobuttonCodec";

export const ElternteilAllgemeineAngabenSchema = z.object({
  name: z.string().min(1),
  istAlleinerziehend: BooleanRadiobuttonCodec,
  istImMutterschutz: OptionalBooleanRadiobuttonCodec,
});

export type ElternteilAllgemeineAngaben = z.infer<
  typeof ElternteilAllgemeineAngabenSchema
>;

const AusklammerungGruendeSchema = z.object({
  hatMutterschutzAelteresKind: z.boolean(),
  hatElterngeldAelteresKind: z.boolean(),
  hatSchwangerschaftsbedingteErkrankung: z.boolean(),
});

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

export const ElternteilAusklammerungZeitenSchema = z.object({
  mutterschutzGeschwisterkind: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
  elterngeldGeschwisterkind: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
  erkrankungSchwangerschaft: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
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
      message: "Bitte treffen Sie mindestens eine Auswahl.",
      path: ["hatKeinEinkommen"],
    },
  );

export const ElternteilTaetigkeitenAbfrageSchema = z.discriminatedUnion(
  "hatKeinEinkommen",
  [
    z.object({ hatKeinEinkommen: z.literal(true) }),
    TaetigkeitenSchema.extend({ hatKeinEinkommen: z.literal(false) }),
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
