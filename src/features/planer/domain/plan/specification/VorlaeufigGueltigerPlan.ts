import { BonusIstKorrektKombiniert } from "./BonusIstKorrektKombiniert";
import { KontingentWurdeEingehalten } from "./KontingentWurdeEingehalten";
import { LimitsProElternteilWurdenEingehalten } from "./LimitsProElternteilWurdenEingehalten";
import { MonateMitMutterschutzSindUnveraendert } from "./MonateMitMutterschutzSindUnveraendert";
import { NurEinLebensmonatBasisParallel } from "./NurEinenLebensmonatBasisParallel";
import { FortlaufenderBezugAbDemZwoelftenLebensmonat } from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";
import { Specification } from "@/features/planer/domain/common/specification";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";

/**
 * Used for the validation while choosing Optionen in a Plan. It helps to
 * prevent the Elternteile to create a plan with invalid combinations of Options
 * etc.
 * This excludes the final validation  part which can not be applied while still
 * actively planning as it would block any Options to be chosen.
 */
export function VorlaeufigGueltigerPlan<
  A extends Ausgangslage,
>(): Specification<Plan<A>> {
  return MonateMitMutterschutzSindUnveraendert<A>()
    .and(NurEinLebensmonatBasisParallel<A>())
    .and(KontingentWurdeEingehalten<A>())
    .and(LimitsProElternteilWurdenEingehalten<A>())
    .and(BonusIstKorrektKombiniert<A>())
    .and(
      Specification.forProperty(
        "lebensmonate",
        FortlaufenderBezugAbDemZwoelftenLebensmonat,
      ),
    );
}
