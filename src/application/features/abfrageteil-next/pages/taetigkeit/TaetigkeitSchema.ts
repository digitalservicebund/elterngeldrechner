import { z } from "zod";
import { BooleanRadiobuttonCodec } from "@/application/features/abfrageteil-next/zod";
import { Steuerklasse } from "@/elterngeldrechner";

export const TaetigkeitSelbststaendigAngabenSchema = z.object({
  istKirchensteuerpflichtig: BooleanRadiobuttonCodec,
  istGesetzlichKrankenpflichtversichert: BooleanRadiobuttonCodec,
  istGesetzlichRentenversichert: BooleanRadiobuttonCodec,
  istGesetzlichArbeitlosenversichert: BooleanRadiobuttonCodec,
  bruttoJahresgewinn: z.number(),
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
  steuerklasse: z.enum(Steuerklasse),
  istKirchensteuerpflichtig: BooleanRadiobuttonCodec,
  istGesetzlichKrankenpflichtversichert: BooleanRadiobuttonCodec,
  istGesetzlichRentenversichert: BooleanRadiobuttonCodec,
  istGesetzlichArbeitlosenversichert: BooleanRadiobuttonCodec,
  istEinkommenGleichVerteilt: BooleanRadiobuttonCodec,
});

export type TaetigkeitNichtSelbststaendigAngaben = z.infer<
  typeof TaetigkeitNichtSelbststaendigAngabenSchema
>;

export const TaetigkeitGleichesEinkommenAngabenSchema = z.object({
  monatsbrutto: z.number(),
});

export type TaetigkeitGleichesEinkommenAngaben = z.infer<
  typeof TaetigkeitGleichesEinkommenAngabenSchema
>;

export const TaetigkeitUnleichesEinkommenAngabenSchema = z.object({
  monatsbruttoDetailsangaben: z.array(z.number()),
});

export type TaetigkeitUnleichesEinkommenAngaben = z.infer<
  typeof TaetigkeitUnleichesEinkommenAngabenSchema
>;

export const WeitereTaetigkeitAbfrageSchema = z.object({
  istWeitereTaetigkeitVorhanden: BooleanRadiobuttonCodec,
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
