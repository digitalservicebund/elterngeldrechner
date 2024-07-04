import { ReactNode } from "react";
import { PlanungsdatenFuerElternteil } from "./types";
import { PlanungsdetailsTable } from "./PlanungsdetailsTable";
import { useAppSelector } from "@/redux/hooks";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";

export function Planungsdetails({
  data,
}: {
  readonly data: PlanungsdatenFuerElternteil[];
}): ReactNode {
  const birthdate = useAppSelector(
    stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum,
  );

  const sumMonths = data[1]
    ? Math.max(data[0].lebensmonate.length, data[1].lebensmonate.length)
    : data[0].lebensmonate.length;

  const elternteile = data;

  return (
    <div className="@container/planungs-details">
      <div className="flex flex-col gap-y-32 @2xl/planungs-details:hidden">
        <PlanungsdetailsTable
          sumMonths={sumMonths}
          birthdate={birthdate}
          elternteile={[elternteile[0]]}
        />
        {elternteile[1] ? (
          <PlanungsdetailsTable
            sumMonths={sumMonths}
            birthdate={birthdate}
            elternteile={[elternteile[1]]}
          />
        ) : (
          ""
        )}
      </div>
      <div className="hidden @2xl/planungs-details:block">
        <PlanungsdetailsTable
          sumMonths={sumMonths}
          birthdate={birthdate}
          elternteile={elternteile}
        />
      </div>
    </div>
  );
}
