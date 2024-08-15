import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import {
  BonusLebensmonateSindFortlaufend,
  BonusWirdNurParallelBezogen,
  KeineOderMindestensZweiLebensmonateBonus,
} from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan";

export function BonusIstKorrektKombiniert<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    BonusWirdNurParallelBezogen.and(
      KeineOderMindestensZweiLebensmonateBonus,
    ).and(BonusLebensmonateSindFortlaufend),
  );
}
