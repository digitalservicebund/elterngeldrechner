import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import type { Ausgangslage } from "@/monatsplaner/ausgangslage";
import { Specification } from "@/monatsplaner/common/specification";
import {
  BonusLebensmonateSindFortlaufend,
  BonusWirdNurParallelBezogen,
  KeineOderMindestensZweiLebensmonateBonus,
} from "@/monatsplaner/lebensmonate";

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
