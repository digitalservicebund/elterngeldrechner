import { z } from "zod";
import { Route } from "./Route";
import { AllgemeineAngabenSchema } from "@/application/features/abfrageteil/pages/allgemeine-angaben/AllgemeineAngabenSchema";
import {
  ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema,
  ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema,
  ElternteilAusklammerungErkrankungAbfrageSchema,
  ElternteilAusklammerungErkrankungZeitenSchema,
  ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
  ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
  ElternteilEinsAllgemeineAngabenSchema,
  ElternteilGemeinsamePlanungAbfrageSchema,
  ElternteilTaetigkeitenAbfrageSchema,
  ElternteilZweiAllgemeineAngabenSchema,
} from "@/application/features/abfrageteil/pages/elternteil/ElternteilSchema";
import {
  GeschwisterkindAbfrageSchema,
  GeschwisterkindAngabenSchema,
  GeschwisterkindAnzahlAbfrageSchema,
} from "@/application/features/abfrageteil/pages/geschwister/GeschwisterSchema";
import {
  GeborenesKindSchema,
  GeburtSchema,
  UngeborenesKindSchema,
  WahrscheinlichGeborenesKindSchema,
} from "@/application/features/abfrageteil/pages/kind/KindSchema";
import {
  TaetigkeitGleichesEinkommenAngabenSchema,
  TaetigkeitMinijobEinkommendetailsAbfrageSchema,
  TaetigkeitNichtSelbststaendigAngabenSchema,
  TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
  TaetigkeitSelbststaendigAngabenSchema,
  TaetigkeitUnleichesEinkommenAngabenSchema,
  WeitereTaetigkeitAbfrageSchema,
  WeitereTaetigkeitArtAbfrageSchema,
} from "@/application/features/abfrageteil/pages/taetigkeit/TaetigkeitSchema";

const ElternteilParams = z.object({ elternteilIndex: z.number() });

const AusklammerungParams = z.object({
  elternteilIndex: z.number(),
  geschwisterIndex: z.number(),
});

const TaetigkeitParams = z.object({
  elternteilIndex: z.number(),
  taetigkeitIndex: z.number(),
});

export const FormEventSchema = z.discriminatedUnion("route", [
  z.object({
    route: z.literal(Route.Startseite),
    payload: z.never().optional(),
  }),
  z.object({
    route: z.literal(Route.AllgemeineAngaben),
    payload: AllgemeineAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.KindAbfrage),
    payload: GeburtSchema,
  }),
  z.object({
    route: z.literal(Route.GeborenesKindAngaben),
    payload: GeborenesKindSchema,
  }),
  z.object({
    route: z.literal(Route.UngeborenesKindAngaben),
    payload: UngeborenesKindSchema,
  }),
  z.object({
    route: z.literal(Route.WahrscheinlichGeborenesKindAbfrage),
    payload: WahrscheinlichGeborenesKindSchema,
  }),
  z.object({
    route: z.literal(Route.GeschwisterkindAbfrage),
    payload: GeschwisterkindAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.GeschwisterkindAnzahlAbfrage),
    payload: GeschwisterkindAnzahlAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.GeschwisterkindAngaben),
    params: z.object({ geschwisterIndex: z.number() }),
    payload: GeschwisterkindAngabenSchema,
    dependentValues: z.object({
      anzahlGeschwister: z.number(),
    }),
  }),
  z.object({
    route: z.literal(Route.GeschwisterbonusUebersicht),
    payload: z.never().optional(),
  }),
  z.object({
    route: z.literal(Route.ElternteilEinsAllgemeineAngaben),
    payload: ElternteilEinsAllgemeineAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilGemeinsamePlanungAbfrage),
    payload: ElternteilGemeinsamePlanungAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungErkrankungAbfrage),
    params: ElternteilParams,
    payload: ElternteilAusklammerungErkrankungAbfrageSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungErkrankungZeitenAngaben),
    params: ElternteilParams,
    payload: ElternteilAusklammerungErkrankungZeitenSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungElternzeitAbfrage),
    params: AusklammerungParams,
    payload: ElternteilAusklammerungElternzeitGeschwisterkindAbfrageSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungElternzeitZeitenAngaben),
    params: AusklammerungParams,
    payload: ElternteilAusklammerungElterngeldGeschwisterkindZeitenSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungMutterschutzAbfrage),
    params: AusklammerungParams,
    payload: ElternteilAusklammerungMutterschutzGeschwisterkindAbfrageSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungMutterschutzZeitenAngaben),
    params: AusklammerungParams,
    payload: ElternteilAusklammerungMutterschutzGeschwisterkindZeitenSchema,
    dependentValues: z.object({
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitenAbfrage),
    params: ElternteilParams,
    payload: ElternteilTaetigkeitenAbfrageSchema,
    dependentValues: z.object({
      istPersonAlleinerziehend: z.boolean(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitenBMZUebersicht),
    params: ElternteilParams,
    payload: z.never().optional(),
    dependentValues: z.object({
      istPersonAlleinerziehend: z.boolean(),
      taetigkeiten: ElternteilTaetigkeitenAbfrageSchema,
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenSelbststaendig),
    params: TaetigkeitParams,
    payload: TaetigkeitSelbststaendigAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenNichtSelbststaendig),
    params: TaetigkeitParams,
    payload: TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
    dependentValues: z.object({
      kannDurchschnittAngegebenWerden: z.boolean(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenMinijob),
    params: TaetigkeitParams,
    payload: TaetigkeitMinijobEinkommendetailsAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenSozialversicherungen),
    params: TaetigkeitParams,
    payload: TaetigkeitNichtSelbststaendigAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenEinkommen),
    params: TaetigkeitParams,
    payload: TaetigkeitGleichesEinkommenAngabenSchema,
    dependentValues: z.object({
      istMischeinkunft: z.boolean(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenEinkommenDetails),
    params: TaetigkeitParams,
    payload: TaetigkeitUnleichesEinkommenAngabenSchema,
    dependentValues: z.object({
      istMischeinkunft: z.boolean(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilWeitereTaetigkeitAbfrage),
    params: TaetigkeitParams,
    payload: WeitereTaetigkeitAbfrageSchema,
    dependentValues: z.object({
      istSelbststaendigeTaetigkeitMoeglich: z.boolean(),
      wirdZweitePersonBeruecksichtigt: z.boolean(),
    }),
  }),
  z.object({
    route: z.literal(Route.ElternteilWeitereTaetigkeitAngaben),
    params: TaetigkeitParams,
    payload: WeitereTaetigkeitArtAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilZweiAllgemeineAngaben),
    payload: ElternteilZweiAllgemeineAngabenSchema,
    dependentValues: z.object({
      istSchwangerschaftsbedingteErkrankungMoeglich: z.boolean(),
      naechsterGeschwisterIndexMitRelevanzFuerAusklammerung: z
        .number()
        .optional(),
    }),
  }),
]);

export type FormEvent = z.infer<typeof FormEventSchema>;

export type PayloadMap = {
  [E in FormEvent as E["route"]]: "payload" extends keyof E
    ? E["payload"]
    : never;
};

export type ParamsMap = {
  [E in FormEvent as E["route"]]: "params" extends keyof E
    ? E["params"]
    : never;
};
