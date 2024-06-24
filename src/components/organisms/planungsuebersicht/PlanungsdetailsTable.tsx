import { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import { PlanungsdetailsMonth } from "./PlanungsdetailsMonth";
import { formatZeitraum } from "@/utils/formatZeitraum";

type Props = {
  readonly sumMonths: number;
  readonly birthdate: Date;
  readonly elternteile: {
    name: string;
    months: {
      type: string;
      isMutterschutzMonth: boolean;
    }[];
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
  sumMonths,
  birthdate,
  elternteile,
}: Props): ReactNode {
  return (
    <table className="w-full border-collapse [&_td]:pb-16 [&_th]:pb-16 [&_tr]:border-0 [&_tr]:border-b-2 [&_tr]:border-solid [&_tr]:border-grey-light">
      <thead>
        <tr className="*:text-left *:align-top *:font-regular">
          <th scope="col">Lebensmonate</th>
          {elternteile.map(({ name }) => (
            <th scope="col" abbr={name} className="pl-32 last:pr-8" key={name}>
              <div className="font-bold">
                <PersonIcon /> {name}
              </div>
              <div className="text-16">verfügbares Einkommen pro Monat</div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="[&_td]:pt-10 [&_th]:pt-10">
        {[...Array(sumMonths)].map((_, index) => (
          <tr className="leading-[2.333]" key={index}>
            <th
              scope="row"
              abbr={`${index + 1}`}
              className="flex items-center px-8 text-left font-regular"
            >
              <div className="min-w-[3ch] font-bold">{index + 1}</div>
              <div className="leading-tight">
                {monthLabel({ birthdate, index })}
              </div>
            </th>
            {elternteile.map(({ months }, i) => (
              <td className="pl-32 align-top last:pr-8" key={`${index}${i}`}>
                <PlanungsdetailsMonth month={months[index]} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
