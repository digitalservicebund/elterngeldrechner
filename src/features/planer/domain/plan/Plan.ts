import type { Elterngeldbezuege } from "@/features/planer/domain/Elterngeldbezuege";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";

export type Plan<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly errechneteElterngeldbezuege: Elterngeldbezuege<
    ElternteileByAusgangslage<A>
  >;
  readonly lebensmonate: Lebensmonate<ElternteileByAusgangslage<A>>;
};
