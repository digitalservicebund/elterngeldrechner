import { BonusIstKorrektKombiniert } from "./BonusIstKorrektKombiniert";
import { KeinBonusFuerNurEinElternteil } from "./KeinBonusFuerNurEinElternteil";
import {
  KontingentFuerBasisWurdeEingehalten,
  KontingentFuerBonusWurdeEingehalten,
  KontingentWurdeEingehalten,
} from "./KontingentWurdeEingehalten";
import { LimitsProElternteilWurdenEingehalten } from "./LimitsProElternteilWurdenEingehalten";
import { MonateMitMutterschutzSindUnveraendert } from "./MonateMitMutterschutzSindUnveraendert";
import { NurEinLebensmonatBasisParallel } from "./NurEinenLebensmonatBasisParallel";
import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import {
  FortlaufenderBezugNachDemVierzehntenLebensmonat,
  KeinBasisNachDemVierzehntenLebensmonat,
} from "@/monatsplaner/Lebensmonate";
import type { Plan } from "@/monatsplaner/Plan";
import { Specification } from "@/monatsplaner/common/specification";

/**
 * Used for the validation while choosing Optionen in a Plan. It helps to
 * prevent the Elternteile to create a plan with invalid combinations of Options
 * etc.
 * This excludes the final validation  part which can not be applied while still
 * actively planning as it would block any Options to be chosen.
 * It also uses preconditions to optimize the violations shown to the user and
 * avoid "duplicates".
 */
export function VorlaeufigGueltigerPlan<
  A extends Ausgangslage,
>(): Specification<Plan<A>> {
  return MonateMitMutterschutzSindUnveraendert<A>()
    .and(KontingentWurdeEingehalten())
    .and(
      NurEinLebensmonatBasisParallel().withPrecondition(
        KontingentFuerBasisWurdeEingehalten(),
      ),
    )
    .and(
      LimitsProElternteilWurdenEingehalten().withPrecondition(
        KontingentFuerBasisWurdeEingehalten(),
      ),
    )
    .and(
      BonusIstKorrektKombiniert().withPrecondition(
        KontingentFuerBonusWurdeEingehalten().withPrecondition(
          KeinBonusFuerNurEinElternteil(),
        ),
      ),
    )
    .and(
      Specification.forProperty<Plan<A>, "lebensmonate">(
        "lebensmonate",
        FortlaufenderBezugNachDemVierzehntenLebensmonat.and(
          KeinBasisNachDemVierzehntenLebensmonat,
        ),
      ).withPrecondition(KontingentFuerBasisWurdeEingehalten()),
    );
}
