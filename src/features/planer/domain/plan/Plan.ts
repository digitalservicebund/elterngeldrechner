import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate";

export type Plan<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
};

export type PlanMitBeliebigenElternteilen = Plan<Ausgangslage>;
