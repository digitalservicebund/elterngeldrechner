import { Ausgangslage } from "./Ausgangslage";
import type { Elternteil } from "./Elternteil";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";
import type { Monat } from "./Monat";
import { Plan } from "./Plan";

export type Elterngeldbezug = number | null;

export type Elterngeldbezuege = Readonly<
  Partial<Record<Lebensmonatszahl, Elterngeldbezug>>
>;

export type BerechneElterngeldbezuegeByElternteilCallback = (
  elternteil: Elternteil,
  monate: Readonly<Partial<Record<Lebensmonatszahl, Monat>>>,
) => Elterngeldbezuege;

export type BerechneElterngeldbezuegeByPlanCallback<A extends Ausgangslage> = (
  plan: Plan<A>,
) => Elterngeldbezuege;
