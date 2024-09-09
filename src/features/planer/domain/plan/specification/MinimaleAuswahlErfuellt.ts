import type { Plan } from "@/features/planer/domain/plan/Plan";
import { Specification } from "@/features/planer/domain/common/specification";
import {
  JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
  MindestensEinMonatWurdeGewaehlt,
} from "@/features/planer/domain/lebensmonate";
import type { Ausgangslage } from "@/features/planer/domain/ausgangslage";

export function MinimaleAuswahlErfuellt<A extends Ausgangslage>() {
  return Specification.forProperty<Plan<A>, "lebensmonate">(
    "lebensmonate",
    MindestensEinMonatWurdeGewaehlt.and(
      JedesElternteilBeziehtKeineOderMindestensZweiLebensmonate,
    ),
  );
}
