import LightbulbIcon from "@digitalservicebund/icons/LightbulbOutlined";
import { ReactNode, useId } from "react";

type Props = {
  readonly validierungsfehler: string[];
};

export function Validierungsfehlerbox({
  validierungsfehler,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section
      className="flex w-full flex-col items-center gap-16 bg-grey-light p-40"
      aria-live="polite"
      aria-labelledby={headingIdentifier}
    >
      <h5 id={headingIdentifier} aria-label="Validierungsfehler">
        <LightbulbIcon className="text-primary" /> Ihre Planung ist noch nicht
        gültig.
      </h5>

      <p className="text-center" aria-label="Liste mit Validierungsfehler">
        {validierungsfehler.map((fehler) => (
          <span key={fehler}>{fehler}</span>
        ))}
      </p>
    </section>
  );
}
