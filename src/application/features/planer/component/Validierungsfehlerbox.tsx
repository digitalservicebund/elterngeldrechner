import classNames from "classnames";
import { ReactNode, useId } from "react";

type Props = {
  readonly validierungsfehler: string[];
  readonly className?: string;
};

export function Validierungsfehlerbox({
  validierungsfehler,
  className,
}: Props): ReactNode {
  const headingIdentifier = useId();
  const hasFehler = validierungsfehler.length > 0;

  return (
    <section
      className={classNames(
        className,
        "p-16",
        "border-0 border-l-4 border-solid border-tertiary bg-tertiary-light",
        { "sr-only": !hasFehler },
      )}
      aria-live="polite"
      aria-labelledby={headingIdentifier}
    >
      <h3
        id={headingIdentifier}
        className="text-base"
        aria-label="Validierungsfehler"
      >
        Bitte beachten Sie:
      </h3>

      <ul
        className="list-inside list-disc"
        aria-label="Liste mit Validierungsfehler"
      >
        {validierungsfehler.map((fehler) => (
          <li key={fehler}>{fehler}</li>
        ))}
      </ul>
    </section>
  );
}
