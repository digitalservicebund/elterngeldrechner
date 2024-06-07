import classNames from "classnames";
import { ReactNode } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";

type Month = "Basis" | "Plus" | "Bonus" | null;

type Props = {
  readonly title: string;
  readonly months: Month[];
};

export function Example({ title, months }: Props): ReactNode {
  const monthClassName = (month: Month) => {
    return classNames(
      "rounded w-[1.75rem] aspect-square flex items-center justify-center leading-none pb-4",
      {
        "egr-elterngeld-basis": month === "Basis",
        "egr-elterngeld-plus": month === "Plus",
        "egr-elterngeld-bonus": month === "Bonus",
        "egr-elterngeld-none": month === null,
      },
    );
  };

  return (
    <div className="flex gap-20 md:pl-56" role="presentation">
      <div className="shrink-0 content-center">
        <PersonIcon />
        {title}
      </div>
      <div className="flex flex-wrap gap-8">
        {months.map((month, index) => (
          <div key={index} className={monthClassName(month)}>
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
