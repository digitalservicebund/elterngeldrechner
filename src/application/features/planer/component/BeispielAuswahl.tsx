import CheckIcon from "@digitalservicebund/icons/Check";
import classNames from "classnames";
import { type ReactNode, useId } from "react";
import type {
  BeispielIdentifier,
  BeschreibungFuerEinBeispiel,
} from "@/application/features/planer/hooks";

type Props = {
  readonly beschreibungenDerBeispiele: BeschreibungFuerEinBeispiel[];
  readonly waehleBeispielAus: (beispiel: BeispielIdentifier) => void;
  readonly istBeispielAusgewaehlt: (beispiel: BeispielIdentifier) => boolean;
  readonly className?: string;
};

export function BeispielAuswahl({
  beschreibungenDerBeispiele,
  waehleBeispielAus,
  istBeispielAusgewaehlt,
  className,
}: Props): ReactNode {
  const headingIdentifier = useId();

  return (
    <section className={className} aria-labelledby={headingIdentifier}>
      <h4 id={headingIdentifier} className="mb-24">
        Nutzen Sie ein Beispiel oder machen Sie Ihre eigene Planung:
      </h4>

      <div
        className="grid gap-x-24 gap-y-16"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(25ch, 1fr)",
          gridTemplateRows: "repeat(3, min-content)",
        }}
      >
        {beschreibungenDerBeispiele.map(
          ({ identifier, titel, beschreibung }) => {
            const headingIdentifier = `${identifier}-heading`;
            const descriptionIdentifier = `${identifier}-description`;
            const waehleDiesesBeispielAus = () => waehleBeispielAus(identifier);
            const istDiesesBeispielAusgewaehlt =
              istBeispielAusgewaehlt(identifier);

            const label = istDiesesBeispielAusgewaehlt
              ? "Übernommen"
              : "Übernehmen";

            const icon = istDiesesBeispielAusgewaehlt ? (
              <CheckIcon />
            ) : undefined;

            return (
              <section
                key={identifier}
                className={classNames(
                  "row-span-3 grid grid-rows-subgrid border-2 border-solid border-off-white p-8 pb-24",
                  { "bg-off-white": istDiesesBeispielAusgewaehlt },
                )}
                aria-describedby={headingIdentifier}
              >
                <div className="flex items-center justify-center bg-off-white px-8 py-10">
                  <h5
                    id={headingIdentifier}
                    className="text-center text-base font-regular"
                  >
                    {titel}
                  </h5>
                </div>

                <p className="px-16 text-text-light">{beschreibung}</p>

                <button
                  className={classNames(
                    "appearance-none mx-32 border border-solid border-primary bg-transparent py-10 text-primary",
                    "hover:bg-primary hover:text-white",
                    {
                      "!bg-primary text-white cursor-default":
                        istDiesesBeispielAusgewaehlt,
                    },
                  )}
                  type="button"
                  aria-label="Übernehme Beispielplan"
                  aria-describedby={`${headingIdentifier} ${descriptionIdentifier}`}
                  aria-pressed={istDiesesBeispielAusgewaehlt}
                  aria-disabled={istDiesesBeispielAusgewaehlt}
                  onClick={waehleDiesesBeispielAus}
                >
                  {icon} {label}
                </button>
              </section>
            );
          },
        )}
      </div>
    </section>
  );
}
