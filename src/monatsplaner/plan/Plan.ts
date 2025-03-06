import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/ausgangslage";
import type { Lebensmonate } from "@/monatsplaner/lebensmonate";

export type Plan<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
};

export type PlanMitBeliebigenElternteilen = Plan<Ausgangslage>;
