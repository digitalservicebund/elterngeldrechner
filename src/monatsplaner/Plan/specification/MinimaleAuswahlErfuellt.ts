import type { Ausgangslage } from "@/monatsplaner/Ausgangslage";
import {
  JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
  MindestensEinMonatWurdeGewaehlt,
  MonateMitBonusHabenBruttoeinkommen,
} from "@/monatsplaner/Lebensmonate";
import type { Plan } from "@/monatsplaner/Plan";
import { Specification } from "@/monatsplaner/common/specification";

export function MinimaleAuswahlErfuellt<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    MindestensEinMonatWurdeGewaehlt.and(
      JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
    ).and(MonateMitBonusHabenBruttoeinkommen),
  );
}
