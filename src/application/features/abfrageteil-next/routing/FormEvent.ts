import { z } from "zod";

import { Route } from "./Route";
import { AllgemeineAngabenSchema } from "@/application/features/abfrageteil-next/pages/allgemeine-angaben/AllgemeineAngabenSchema";
import {
  ElternteilAllgemeineAngabenSchema,
  ElternteilAusklammerungGruendeSchema,
  ElternteilAusklammerungZeitenSchema,
  ElternteilTaetigkeitenAbfrageSchema,
  ElternteilZweitePersonAngabenSchema,
} from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilSchema";
import {
  GeschwisterkindAbfrageSchema,
  GeschwisterkindAngabenSchema,
} from "@/application/features/abfrageteil-next/pages/geschwister/GeschwisterSchema";
import {
  GeborenesKindSchema,
  GeburtSchema,
  UngeborenesKindSchema,
  WahrscheinlichGeborenesKindSchema,
} from "@/application/features/abfrageteil-next/pages/kind/KindSchema";
import {
  TaetigkeitGleichesEinkommenAngabenSchema,
  TaetigkeitMinijobEinkommendetailsAbfrageSchema,
  TaetigkeitNichtSelbststaendigAngabenSchema,
  TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
  TaetigkeitSelbststaendigAngabenSchema,
  TaetigkeitUnleichesEinkommenAngabenSchema,
  WeitereTaetigkeitAbfrageSchema,
  WeitereTaetigkeitArtAbfrageSchema,
} from "@/application/features/abfrageteil-next/pages/taetigkeit/TaetigkeitSchema";

const ElternteilParams = z.object({ elternteilIndex: z.number() });

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
    route: z.literal(Route.GeschwisterkindAngaben),
    params: z.object({ geschwisterIndex: z.number() }),
    payload: GeschwisterkindAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilAllgemeineAngaben),
    params: ElternteilParams,
    payload: ElternteilAllgemeineAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungGruendeAngaben),
    params: ElternteilParams,
    payload: ElternteilAusklammerungGruendeSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilAusklammerungZeitenAngaben),
    params: ElternteilParams,
    payload: ElternteilAusklammerungZeitenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitenAbfrage),
    params: ElternteilParams,
    payload: ElternteilTaetigkeitenAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenSelbststaendig),
    params: TaetigkeitParams,
    payload: TaetigkeitSelbststaendigAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenMischeinkunft),
    params: TaetigkeitParams,
    payload: TaetigkeitSelbststaendigAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenNichtSelbststaendig),
    params: TaetigkeitParams,
    payload: TaetigkeitNichtSelbststaendigMinijobAbfrageSchema,
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
  }),
  z.object({
    route: z.literal(Route.ElternteilTaetigkeitAngabenEinkommenDetails),
    params: TaetigkeitParams,
    payload: TaetigkeitUnleichesEinkommenAngabenSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilWeitereTaetigkeitAbfrage),
    params: TaetigkeitParams,
    payload: WeitereTaetigkeitAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilWeitereTaetigkeitAngaben),
    params: TaetigkeitParams,
    payload: WeitereTaetigkeitArtAbfrageSchema,
  }),
  z.object({
    route: z.literal(Route.ElternteilZweitePersonAngaben),
    payload: ElternteilZweitePersonAngabenSchema,
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
