import { BonusIstKorrektKombiniert } from "./BonusIstKorrektKombiniert";
import { KontingentWurdeEingehalten } from "./KontingentWurdeEingehalten";
import { LimitsProElternteilWurdenEingehalten } from "./LimitsProElternteilWurdenEingehalten";
import { MonateMitMutterschutzSindUnveraendert } from "./MonateMitMutterschutzSindUnveraendert";
import { NurEinLebensmonatBasisParallel } from "./NurEinenLebensmonatBasisParallel";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";

export function GueltigerPlan<A extends Ausgangslage>() {
  return MonateMitMutterschutzSindUnveraendert<A>()
    .and(NurEinLebensmonatBasisParallel<A>())
    .and(KontingentWurdeEingehalten<A>())
    .and(LimitsProElternteilWurdenEingehalten<A>())
    .and(BonusIstKorrektKombiniert<A>());
}
