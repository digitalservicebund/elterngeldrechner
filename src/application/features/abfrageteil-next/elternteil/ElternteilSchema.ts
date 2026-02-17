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
    hatKeinAusklammerungsgruende: z.boolean(),
  })
  .refine(
    (data) => {
      const hatIrgendeinenGrund =
        data.hatMutterschutzAelteresKind ||
        data.hatElterngeldAelteresKind ||
        data.hatSchwangerschaftsbedingteErkrankung;

      return hatIrgendeinenGrund && data.hatKeinAusklammerungsgruende
        ? false
        : true;
    },
    {
      message:
        "Widersprüchliche Angaben: Sie können nicht gleichzeit Gründe angeben und 'Keine Gründe' auswählen.",
      path: ["hatKeinAusklammerungsgruende"],
    },
  );

export type ElternteilAusklammerungGruende = z.infer<
  typeof ElternteilAusklammerungGruendeSchema
>;

export const ElternteilAusklammerungZeitenSchema = z.array(
  z.object({
    grund: z.enum(["mutterschutz", "elterngeld", "erkrankung"]),
    von: GermanDateInputCodec,
    bis: GermanDateInputCodec,
  }),
);

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
