import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";
import { Specification } from "@/features/planer/domain/common/specification";
import {
  JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
  MindestensEinMonatWurdeGewaehlt,
  MonateMitBonusHabenBruttoeinkommen,
} from "@/features/planer/domain/lebensmonate";
import type { Plan } from "@/features/planer/domain/plan/Plan";

export function MinimaleAuswahlErfuellt<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    MindestensEinMonatWurdeGewaehlt.and(
      JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
    ).and(MonateMitBonusHabenBruttoeinkommen),
  );
}
