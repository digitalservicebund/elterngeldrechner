import { ReactNode } from "react";
import { Elternteil } from "./Elternteil";
import { usePlanungdaten } from "./usePlanungsdaten";

export function Planungsuebersicht(): ReactNode {
  const data = usePlanungdaten();

  return (
    <div className="flex flex-wrap gap-16 *:grow">
      {data.map((entry) => (
        <Elternteil key={entry.name} {...entry} />
      ))}
    </div>
  );
}
