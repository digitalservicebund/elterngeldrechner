import { ReactNode } from "react";
import { Elternteil } from "./Elternteil";
import { PlanungsdatenFuerElternteil } from "./types";

export function Planungsuebersicht({
  data,
}: {
  readonly data: PlanungsdatenFuerElternteil[];
}): ReactNode {
  return (
    <div
      className="flex flex-wrap gap-16 *:grow"
      data-testid="planungsuebersicht"
    >
      {data.map((entry) => (
        <Elternteil key={entry.name} {...entry} />
      ))}
    </div>
  );
}
