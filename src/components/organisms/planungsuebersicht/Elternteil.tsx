import { ReactNode, useId } from "react";
import PersonIcon from "@digitalservicebund/icons/PersonOutline";
import classNames from "classnames";
import { PlanungsdatenFuerElternteil, Variante, Zeitraum } from "./types";
import { VariantenDetails } from "./VariantenDetails";
import { formatAsCurrency } from "@/utils/locale-formatting";

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
        {ELTERNGELD_VARIANTEN.map((variante) => (
          <li key={variante} className="flex items-start gap-24 py-8">
            <VariantenDetails variante={variante} details={details[variante]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatZeitraum(zeitraum: Zeitraum): string {
  const { from, to } = zeitraum;
  const isSpanningTwoYears = from.getFullYear() < to.getFullYear();

  const formattedFrom = zeitraum.from.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: isSpanningTwoYears ? "numeric" : undefined,
  });

  const formattedTo = zeitraum.to.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return `${formattedFrom} bis ${formattedTo}`;
}

const ELTERNGELD_VARIANTEN: Variante[] = ["BEG", "EG+", "PSB"];
