import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import {
  BonusLebensmonateSindFortlaufend,
  BonusWirdNurParallelBezogen,
  KeineOderMindestensZweiLebensmonateBonus,
} from "@/features/planer/domain/lebensmonate";

export function BonusIstKorrektKombiniert<A extends Ausgangslage>() {
  return KeinBonusFuerNurEinElternteil<A>().and(
    Specification.forProperty(
      "lebensmonate",
      BonusWirdNurParallelBezogen.and(
        KeineOderMindestensZweiLebensmonateBonus,
      ).and(BonusLebensmonateSindFortlaufend),
    ),
  );
}
