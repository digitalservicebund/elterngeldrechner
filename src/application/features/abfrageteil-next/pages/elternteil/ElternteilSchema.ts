import { z } from "zod";
import {
  BooleanRadiobuttonCodec,
  GermanDateInputCodec,
} from "@/application/features/abfrageteil-next/zod";
import { OptionalBooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/zod/codecs/OptionalBooleanRadiobuttonCodec";

export const ElternteilAllgemeineAngabenSchema = z.object({
  name: z.string(),
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
  mutterschutz: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
  elterngeld: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
  erkrankung: z.array(
    z.object({
      von: GermanDateInputCodec,
      bis: GermanDateInputCodec,
    }),
  ),
});

export type ElternteilAusklammerungZeiten = z.infer<
  typeof ElternteilAusklammerungZeitenSchema
>;

const TaetigkeitenSchema = z.object({
  istNichtSelbststaendig: z.boolean(),
  istSelbststaendig: z.boolean(),
  istVerbeamtet: z.boolean(),
  hatAndereLeistungen: z.boolean(),
});

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

export const ElternteilZweitePersonAngabenSchema = z.object({
  wirdZweitePersonBeruecksichtigt: OptionalBooleanRadiobuttonCodec,
  name: z.string(),
});

export type ElternteilZweitePersonAngaben = z.infer<
  typeof ElternteilZweitePersonAngabenSchema
>;
