import type { Lebensmonate } from "@/features/planer/domain/lebensmonate";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/Ausgangslage";

export type Plan<A extends Ausgangslage = Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
};
