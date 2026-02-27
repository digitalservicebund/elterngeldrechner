import { Route } from "./Route";

import type { AllgemeineAngaben } from "@/application/features/abfrageteil-next/pages/allgemeine-angaben";

import type {
  ElternteilAllgemeineAngaben,
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungZeiten,
  ElternteilTaetigkeitenAbfrage,
} from "@/application/features/abfrageteil-next/pages/elternteil";

import { ElternteilZweitePersonAngaben } from "@/application/features/abfrageteil-next/pages/elternteil/ElternteilSchema";
import type {
  GeschwisterkindAbfrage,
  GeschwisterkindAngaben,
} from "@/application/features/abfrageteil-next/pages/geschwister";

import type {
  GeborenesKind,
  Geburt,
  UngeborenesKind,
  WahrscheinlichGeborenesKind,
} from "@/application/features/abfrageteil-next/pages/kind";
import {
  TaetigkeitGleichesEinkommenAngaben,
  TaetigkeitMinijobEinkommendetailsAbfrage,
  TaetigkeitNichtSelbststaendigAngaben,
  TaetigkeitNichtSelbststaendigMinijobAbfrage,
  TaetigkeitSelbststaendigAngaben,
  TaetigkeitUnleichesEinkommenAngaben,
  WeitereTaetigkeitAbfrage,
  WeitereTaetigkeitArtAbfrage,
} from "@/application/features/abfrageteil-next/pages/taetigkeit/TaetigkeitSchema";

export type FormEvent =
  | { route: Route.Startseite; payload?: never }
  | { route: Route.AllgemeineAngaben; payload: AllgemeineAngaben }
  | { route: Route.KindAbfrage; payload: Geburt }
  | { route: Route.GeborenesKindAngaben; payload: GeborenesKind }
  | { route: Route.UngeborenesKindAngaben; payload: UngeborenesKind }
  | {
      route: Route.WahrscheinlichGeborenesKindAbfrage;
      payload: WahrscheinlichGeborenesKind;
    }
  | { route: Route.GeschwisterkindAbfrage; payload: GeschwisterkindAbfrage }
  | {
      route: Route.GeschwisterkindAngaben;
      params: { geschwisterIndex: number };
      payload: GeschwisterkindAngaben;
    }
  | {
      route: Route.ElternteilAllgemeineAngaben;
      params: { elternteilIndex: number };
      payload: ElternteilAllgemeineAngaben;
    }
  | {
      route: Route.ElternteilAusklammerungGruendeAngaben;
      params: { elternteilIndex: number };
      payload: ElternteilAusklammerungGruende;
    }
  | {
      route: Route.ElternteilAusklammerungZeitenAngaben;
      params: { elternteilIndex: number };
      payload: ElternteilAusklammerungZeiten;
    }
  | {
      route: Route.ElternteilTaetigkeitenAbfrage;
      params: { elternteilIndex: number };
      payload: ElternteilTaetigkeitenAbfrage;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenSelbststaendig;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitSelbststaendigAngaben;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenMischeinkunft;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitSelbststaendigAngaben;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenNichtSelbststaendig;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitNichtSelbststaendigMinijobAbfrage;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenMinijob;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitMinijobEinkommendetailsAbfrage;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenSozialversicherungen;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitNichtSelbststaendigAngaben;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenEinkommen;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitGleichesEinkommenAngaben;
    }
  | {
      route: Route.ElternteilTaetigkeitAngabenEinkommenDetails;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: TaetigkeitUnleichesEinkommenAngaben;
    }
  | {
      route: Route.ElternteilWeitereTaetigkeitAbfrage;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: WeitereTaetigkeitAbfrage;
    }
  | {
      route: Route.ElternteilWeitereTaetigkeitAngaben;
      params: { elternteilIndex: number; taetigkeitIndex: number };
      payload: WeitereTaetigkeitArtAbfrage;
    }
  | {
      route: Route.ElternteilZweitePersonAngaben;
      payload: ElternteilZweitePersonAngaben;
    };

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
