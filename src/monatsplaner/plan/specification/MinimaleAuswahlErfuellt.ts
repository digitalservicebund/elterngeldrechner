import type { Ausgangslage } from "@/monatsplaner/ausgangslage";
import { Specification } from "@/monatsplaner/common/specification";
import {
  JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
  MindestensEinMonatWurdeGewaehlt,
  MonateMitBonusHabenBruttoeinkommen,
} from "@/monatsplaner/lebensmonate";
import type { Plan } from "@/monatsplaner/plan/Plan";

export function MinimaleAuswahlErfuellt<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    MindestensEinMonatWurdeGewaehlt.and(
      JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
    ).and(MonateMitBonusHabenBruttoeinkommen),
  );
}
