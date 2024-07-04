import { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { PlanungsdetailsMonth } from "./PlanungsdetailsMonth";
import { Lebensmonat } from "./types";
import { formatZeitraum } from "@/utils/formatZeitraum";

type Props = {
  readonly lastMonthIndexToShow: number;
  readonly birthdate: Date;
  readonly elternteile: {
    name: string;
    lebensmonate: Lebensmonat[];
  }[];
};

const monthLabel = ({
  birthdate,
  index,
}: {
  birthdate: Date;
  index: number;
}) => {
  const from = new Date(birthdate);
  from.setMonth(from.getMonth() + index);
  const to = new Date(from);
  to.setMonth(to.getMonth() + 1);
  to.setDate(to.getDate() - 1);
  return formatZeitraum({ from, to });
};

export function PlanungsdetailsTable({
  lastMonthIndexToShow,
  birthdate,
  elternteile,
}: Props): ReactNode {
  return (
    <table className="w-full border-collapse [&_td]:pb-16 [&_th]:pb-16 [&_tr]:border-0 [&_tr]:border-b-2 [&_tr]:border-solid [&_tr]:border-grey-light">
      <thead>
        <tr className="text-left font-bold">
          <th scope="col">Lebensmonate</th>
          {elternteile.map(({ name }) => (
            <th scope="col" abbr={name} className="pl-32 last:pr-8" key={name}>
              <PersonIcon /> {name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&_td]:pt-10 [&_th]:pt-10">
        {[...Array(lastMonthIndexToShow + 1)].map((_, monthIndex) => (
          <tr className="leading-[2.333]" key={monthIndex}>
            <th
              scope="row"
              abbr={`${monthIndex + 1}`}
              className="flex items-center px-8 text-left font-regular"
            >
              <div className="min-w-[3ch] font-bold">{monthIndex + 1}</div>
              <div className="leading-tight">
                {monthLabel({ birthdate, index: monthIndex })}
              </div>
            </th>

            {elternteile.map(({ lebensmonate }, elternteilIndex) => {
              const lebensmonat =
                lebensmonate[monthIndex] ?? FILLER_LEBENSMONAT;
              return (
                <td
                  className="pl-32 align-top last:pr-8"
                  key={`${monthIndex}${elternteilIndex}`}
                >
                  <PlanungsdetailsMonth {...lebensmonat} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

const FILLER_LEBENSMONAT: Lebensmonat = {
  variante: "None",
  isMutterschutzMonth: false,
  elterngeld: 0,
  nettoEinkommen: 0,
  verfuegbaresEinkommen: 0,
};
