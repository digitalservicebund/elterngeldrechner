import { z } from "zod";
import { BooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/zod";
import { Steuerklasse } from "@/elterngeldrechner";

const BruttoJahresgewinn = z.coerce
  .number({ error: "Invalide Eingabe" })
  .max(
    175000,
    "Sie überschreiten das Maximaleinkommen, um Elterngeld zu bekommen",
  );

export const TaetigkeitSelbststaendigAngabenSchema = z.object({
  istKirchensteuerpflichtig: BooleanRadiobuttonCodec,
  istGesetzlichKrankenpflichtversichert: BooleanRadiobuttonCodec,
  istGesetzlichRentenversichert: BooleanRadiobuttonCodec,
  istGesetzlichArbeitlosenversichert: BooleanRadiobuttonCodec,
  bruttoJahresgewinn: BruttoJahresgewinn,
});

export type TaetigkeitSelbststaendigAngaben = z.infer<
  typeof TaetigkeitSelbststaendigAngabenSchema
>;

export const TaetigkeitNichtSelbststaendigMinijobAbfrageSchema = z.object({
  istTaetigkeitMinijob: BooleanRadiobuttonCodec,
});

export type TaetigkeitNichtSelbststaendigMinijobAbfrage = z.infer<
  typeof TaetigkeitNichtSelbststaendigMinijobAbfrageSchema
>;

export const TaetigkeitMinijobEinkommendetailsAbfrageSchema = z.object({
  istEinkommenGleichVerteilt: BooleanRadiobuttonCodec,
});

export type TaetigkeitMinijobEinkommendetailsAbfrage = z.infer<
  typeof TaetigkeitMinijobEinkommendetailsAbfrageSchema
>;

export const TaetigkeitNichtSelbststaendigAngabenSchema = z.object({
  steuerklasse: z.enum(
    Steuerklasse,
    "Wählen Sie bitte eine der Steuerklassen aus",
  ),
  istKirchensteuerpflichtig: BooleanRadiobuttonCodec,
  istGesetzlichKrankenpflichtversichert: BooleanRadiobuttonCodec,
  istGesetzlichRentenversichert: BooleanRadiobuttonCodec,
  istGesetzlichArbeitlosenversichert: BooleanRadiobuttonCodec,
  istEinkommenGleichVerteilt: BooleanRadiobuttonCodec,
});

export type TaetigkeitNichtSelbststaendigAngaben = z.infer<
  typeof TaetigkeitNichtSelbststaendigAngabenSchema
>;

const BruttoMonatseinkommen = z.coerce
  .number({ error: "Invalide Eingabe" })
  .max(
    15000,
    "Sie überschreiten das Maximaleinkommen, um Elterngeld zu bekommen",
  )
  .min(1, "Bitte geben Sie ein Einkommen an");

export const TaetigkeitGleichesEinkommenAngabenSchema = z.object({
  durchschnittlichesMonatsbrutto: BruttoMonatseinkommen,
});

export type TaetigkeitGleichesEinkommenAngaben = z.infer<
  typeof TaetigkeitGleichesEinkommenAngabenSchema
>;

export const TaetigkeitUnleichesEinkommenAngabenSchema = z.object({
  monatsbrutto: z.array(BruttoMonatseinkommen).length(12),
});

export type TaetigkeitUnleichesEinkommenAngaben = z.infer<
  typeof TaetigkeitUnleichesEinkommenAngabenSchema
>;

export const WeitereTaetigkeitAbfrageSchema = z.object({
  istWeitereTaetigkeitVorhanden: BooleanRadiobuttonCodec,
  istSelbststaendigeTaetigkeitMoeglich: z.boolean(),
  istPersonAlleinerziehend: z.boolean(),
});

export type WeitereTaetigkeitAbfrage = z.infer<
  typeof WeitereTaetigkeitAbfrageSchema
>;

export const WeitereTaetigkeitArtAbfrageSchema = z.object({
  istWeitereTaetigkeitSelbststaendigeTaetigkeit: BooleanRadiobuttonCodec,
});

export type WeitereTaetigkeitArtAbfrage = z.infer<
  typeof WeitereTaetigkeitArtAbfrageSchema
>;
