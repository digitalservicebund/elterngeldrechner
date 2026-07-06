import { ReactNode, useId } from "react";
import LightbulbIcon from "~icons/material-symbols/lightbulb-outline";

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
      <p
        id={headingIdentifier}
        className="font-bold"
        aria-label="Validierungsfehler"
      >
        <LightbulbIcon className="text-primary" /> Ihre Planung ist noch nicht
        gültig.
      </p>

      <p className="text-center" aria-label="Liste mit Validierungsfehler">
        {validierungsfehler.map((fehler) => (
          <span key={fehler}>{fehler}</span>
        ))}
      </p>
    </section>
  );
}
