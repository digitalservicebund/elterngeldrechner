import type { PlanMitBeliebigenElternteilen } from "./domain";
import { Planer as TypedPlaner } from "./user-interface/component/Planer";
import { usePlanerService } from "./user-interface/service/usePlanerService";

export { type PlanMitBeliebigenElternteilen } from "./domain/plan";
export { Zusammenfassung } from "./user-interface/component/zusammenfassung";

type Props = {
  readonly initialPlan: PlanMitBeliebigenElternteilen | undefined;
  readonly onPlanChanged: (plan: PlanMitBeliebigenElternteilen) => void;
  readonly className?: string;
};

export function Planer({ initialPlan, onPlanChanged, className }: Props) {
  const serviceProperties = usePlanerService(initialPlan, onPlanChanged);
  return <TypedPlaner className={className} {...serviceProperties} />;
}
