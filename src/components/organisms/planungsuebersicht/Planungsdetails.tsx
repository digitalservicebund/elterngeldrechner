import { ReactNode } from "react";
import { PlanungsdatenFuerElternteil } from "./types";
import { PlanungsdetailsTable } from "./PlanungsdetailsTable";
import { useAppSelector } from "@/redux/hooks";
import { stepNachwuchsSelectors } from "@/redux/stepNachwuchsSlice";

type Props = {
  readonly data: PlanungsdatenFuerElternteil[];
};

export function Planungsdetails({ data }: Props): ReactNode {
  const birthdate = useAppSelector(
    stepNachwuchsSelectors.getWahrscheinlichesGeburtsDatum,
  );

  const lastMonthIndexToShow =
    Math.max(...data.map(({ lebensmonate }) => lebensmonate.length)) - 1;

  const elternteile = data;

  return (
    <div className="@container/planungs-details">
      <div className="flex flex-col gap-y-32 @2xl/planungs-details:hidden">
        {elternteile.map((elternteil) => (
          <PlanungsdetailsTable
            key={elternteil.name}
            lastMonthIndexToShow={lastMonthIndexToShow}
            birthdate={birthdate}
            elternteile={[elternteil]}
          />
        ))}
      </div>
      <div className="hidden @2xl/planungs-details:block">
        <PlanungsdetailsTable
          lastMonthIndexToShow={lastMonthIndexToShow}
          birthdate={birthdate}
          elternteile={elternteile}
        />
      </div>
    </div>
  );
}
