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

export const ElternteilAusklammerungGruendeSchema = z
  .object({
    hatMutterschutzAelteresKind: z.boolean(),
    hatElterngeldAelteresKind: z.boolean(),
    hatSchwangerschaftsbedingteErkrankung: z.boolean(),
    hatKeineAusklammerungsgruende: z.boolean(),
  })
  .refine(
    (data) => {
      const hatIrgendeinenGrund =
        data.hatMutterschutzAelteresKind ||
        data.hatElterngeldAelteresKind ||
        data.hatSchwangerschaftsbedingteErkrankung;

      return hatIrgendeinenGrund && data.hatKeineAusklammerungsgruende
        ? false
        : true;
    },
    {
      message:
        "Widersprüchliche Angaben: Sie können nicht gleichzeit Gründe angeben und 'Keine Gründe' auswählen.",
      path: ["hatKeineAusklammerungsgruende"],
    },
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

export const ElternteilTaetigkeitenAbfrageSchema = z.object({
  istNichtSelbststaendig: z.boolean(),
  istSelbststaendig: z.boolean(),
  istVerbeamtet: z.boolean(),
  hatAndereLeistungen: z.boolean(),
  hatKeinEinkommen: z.boolean(),
});

export type ElternteilTaetigkeitenAbfrage = z.infer<
  typeof ElternteilTaetigkeitenAbfrageSchema
>;
