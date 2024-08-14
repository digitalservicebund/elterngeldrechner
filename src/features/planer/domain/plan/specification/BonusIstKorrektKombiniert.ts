import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import { BonusWirdNurParallelBezogen } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function BonusIstKorrektKombiniert<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    BonusWirdNurParallelBezogen,
  );
}
