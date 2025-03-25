import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/monatsplaner/Ausgangslage";
import type { Lebensmonate } from "@/monatsplaner/Lebensmonate";

export type Plan<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
};

export type PlanMitBeliebigenElternteilen = Plan<Ausgangslage>;
