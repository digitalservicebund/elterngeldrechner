import { ReactNode } from "react";
import { VariantLabel } from "./VariantLabel";
import { ContingentPerVariant } from "./types";
import { BoxGraph } from "./BoxGraph";

type Props = {
  months: ContingentPerVariant;
};

export function PlanningContingent({ months }: Props): ReactNode {
  const isBonusAvailable = months.bonus.available + months.bonus.taken > 0;

  return (
    <header
      aria-label="Kontingent von planbaren Monaten"
      className="flex flex-wrap justify-between gap-8"
    >
      <VariantLabel
        name="Basis"
        monthsAvailable={months.basis.available}
        monthsTaken={months.basis.taken}
        className="bg-Basis text-white"
      />

      {isBonusAvailable && (
        <VariantLabel
          name="Bonus"
          monthsAvailable={months.bonus.available}
          monthsTaken={months.bonus.taken}
          className="bg-Bonus text-black"
        />
      )}

      <BoxGraph months={months} className="basis-full" />

      <VariantLabel
        name="Plus"
        monthsAvailable={months.plus.available}
        monthsTaken={months.plus.taken}
        className="bg-Plus text-black"
      />
    </header>
  );
}
