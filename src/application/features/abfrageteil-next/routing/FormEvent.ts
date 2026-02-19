import { Route } from "./Route";

import { AllgemeineAngaben } from "@/application/features/abfrageteil-next/allgemeine-angaben/AllgemeineAngabenSchema";
import {
  ElternteilAllgemeineAngaben,
  ElternteilAusklammerungGruende,
  ElternteilAusklammerungZeiten,
  ElternteilTaetigkeitenAbfrage,
} from "@/application/features/abfrageteil-next/elternteil/ElternteilSchema";
import {
  GeschwisterkindAbfrage,
  GeschwisterkindAngaben,
} from "@/application/features/abfrageteil-next/geschwister/GeschwisterSchema";
import {
  GeborenesKind,
  Geburt,
  UngeborenesKind,
  WahrscheinlichGeborenesKind,
} from "@/application/features/abfrageteil-next/kind/KindSchema";

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
      params: { elternteilIndex: 0 | 1 };
      payload: ElternteilAllgemeineAngaben;
    }
  | {
      route: Route.ElternteilAusklammerungGruendeAngaben;
      params: { elternteilIndex: 0 | 1 };
      payload: ElternteilAusklammerungGruende;
    }
  | {
      route: Route.ElternteilAusklammerungZeitenAngaben;
      params: { elternteilIndex: 0 | 1 };
      payload: ElternteilAusklammerungZeiten;
    }
  | {
      route: Route.ElternteilTaetigkeitenAbfrage;
      params: { elternteilIndex: 0 | 1 };
      payload: ElternteilTaetigkeitenAbfrage;
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
