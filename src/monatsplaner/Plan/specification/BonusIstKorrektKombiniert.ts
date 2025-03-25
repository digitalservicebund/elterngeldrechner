import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import {
  BonusLebensmonateSindFortlaufend,
  BonusWirdNurParallelBezogen,
  KeineOderMindestensZweiLebensmonateBonus,
} from "@/monatsplaner/Lebensmonate";
import { Specification } from "@/monatsplaner/common/specification";

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
