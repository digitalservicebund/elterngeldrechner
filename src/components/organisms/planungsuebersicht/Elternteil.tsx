import { ReactNode, useId } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import { PlanungsdatenFuerElternteil } from "./types";
import { VariantenDetails } from "./VariantenDetails";
import { formatAsCurrency } from "@/utils/formatAsCurrency";
import { formatZeitraum } from "@/utils/date";

interface Props extends PlanungsdatenFuerElternteil {}

export function Elternteil({
  name,
  totalNumberOfMonths,
  geldInsgesamt,
  zeitraeueme,
  details,
}: Props): ReactNode {
  const formattedGeldInsgesamt = formatAsCurrency(geldInsgesamt);
  const zeitraeumeHeadingIdentifier = useId();
  const formattedZeitraeume = zeitraeueme.map(formatZeitraum);

  return (
    <div className="flex flex-col gap-8">
      <h4 className="text-base">
        <PersonIcon /> {name}
      </h4>

      <span>
        {totalNumberOfMonths} Monate Elterngeld |{" "}
        <span className="font-bold">insgesamt {formattedGeldInsgesamt}</span>
      </span>

      <div aria-labelledby={zeitraeumeHeadingIdentifier} className="mb-auto">
        <span className="text-basis" id={zeitraeumeHeadingIdentifier}>
          Elterngeld im Zeitraum:
        </span>

        <ul className="list-none">
          {formattedZeitraeume.map((zeitraum) => (
            <li key={zeitraum}>{zeitraum}</li>
          ))}
        </ul>
      </div>

      <ul
        aria-label="Details pro Elterngeldvariante"
        className={classNames(
          "list-none",
          /* TODO: shorten list when utility classes work properly again */
          "divide-x-0 divide-y-2 divide-solid divide-off-white",
          "border-x-0 border-y-2 border-solid border-off-white",
        )}
      >
        {ELTERNGELD_VARIANTEN_TO_SHOW.map((variante) => (
          <li key={variante} className="flex items-start gap-24 py-8">
            <VariantenDetails variante={variante} details={details[variante]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

const ELTERNGELD_VARIANTEN_TO_SHOW = ["BEG", "EG+", "PSB"] as const;
