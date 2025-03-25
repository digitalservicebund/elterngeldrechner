import ArrowBackIosIcon from "@digitalservicebund/icons/ArrowBackIos";
import CheckIcon from "@digitalservicebund/icons/Check";
import classNames from "classnames";
import { Fragment, type ReactNode, useId } from "react";
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
    <section
      className={classNames("@container/beispiele", className)}
      aria-labelledby={headingIdentifier}
    >
      <h4 id={headingIdentifier} className="mb-16">
        Nutzen Sie ein Beispiel oder machen Sie Ihre eigene Planung:
      </h4>

      <div
        className="flex flex-col gap-x-24 gap-y-4 @2xl/beispiele:grid"
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

            /*
             * TRIGGER WARNING
             *
             * The user interface design requires two different renderings based
             * on the screen/container width. We try to avoid such designs where
             * ever possible and rather rely on intrinsic styling. However, this
             * currently must be an exception.
             *
             * There was an attempt to represent this concept properly in code
             * and avoid duplication. Like on the surface it looks like one JSX
             * element tree. And it was verbosely communicating what is shared
             * styling and where does it diverge. However, it became very
             * tedious, required tons of code and there was always an exception
             * in the design left.
             * In result it is much easier to copy-paste what is needed and
             * maintain both element trees separately. From a clean code
             * perspective this is a huge bummer. But the reality is that this
             * code here is currently the (very) bitter sweet spot that comes
             * with such designs.
             */
            return (
              <Fragment key={identifier}>
                {/* for big screens */}
                <section
                  className={classNames(
                    "hidden @2xl/beispiele:grid",
                    "grid-rows-subgrid row-span-3 p-8 pb-24 border-2 border-solid border-off-white",
                    istDiesesBeispielAusgewaehlt && "bg-off-white",
                  )}
                  aria-describedby={headingIdentifier}
                >
                  <div className="flex items-center justify-center bg-off-white p-8 text-center">
                    <h5
                      id={headingIdentifier}
                      className="text-base font-regular leading-6"
                    >
                      {titel}
                    </h5>
                  </div>

                  <p className="m-16 p-0 text-text-light">{beschreibung}</p>

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

                {/* for small screens */}
                <details
                  className={classNames(
                    "@2xl/beispiele:hidden",
                    "group border-2 border-solid border-off-white",
                    istDiesesBeispielAusgewaehlt && "bg-off-white",
                  )}
                  aria-describedby={headingIdentifier}
                >
                  <summary className="flex items-center bg-off-white p-16">
                    <h5
                      id={headingIdentifier}
                      className="text-base font-regular leading-6"
                    >
                      {titel}
                    </h5>

                    <ArrowBackIosIcon className="ml-auto -translate-y-4 -rotate-90 group-open:translate-y-4 group-open:rotate-90" />
                  </summary>

                  <div className="mx-16 flex flex-col gap-16 pb-24">
                    <p className="p-0 text-text-light">{beschreibung}</p>

                    <button
                      className={classNames(
                        "appearance-none border border-solid border-primary bg-transparent py-10 text-primary",
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
                  </div>
                </details>
              </Fragment>
            );
          },
        )}
      </div>
    </section>
  );
}
