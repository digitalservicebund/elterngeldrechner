import ArrowBackIosIcon from "@digitalservicebund/icons/ArrowBackIos";
import CheckIcon from "@digitalservicebund/icons/Check";
import classNames from "classnames";
import { Fragment, type ReactNode, useId } from "react";
import type {
  BeispielIdentifier,
  BeschreibungFuerEinBeispiel,
} from "@/application/features/beispiele/hooks";

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
             * CLEAN CODE WARNING
             *
             * The whole Planer feature has high demands of screen/window space.
             * It's design is highly thought-out to make best use of any
             * available space to adapt responsively to "all"
             * screen/window/font-sizes and zoom level.
             * This holds true for the aspect of the Beispiel selection. Here it
             * is additionally important that the user can see enough on his
             * screen to gasp what is happening during interactions in the
             * overall Planer context. Like what happens when a Beispiel is
             * selected. This is very tricky on small screens/windows.
             *
             * To address this problem, it was necessary to have a separate
             * design for smaller screens. This design does not only affect the
             * styling, but also semantics and interactions. In exact, for small
             * windows the Beispiele should be collapsible. Though, for big
             * windows this is be rather ineffective and should be allowed to
             * occupy more space.
             *
             * Having this design for an improved user experience comes with
             * some challenges for the implementation. After some serious
             * attempts to produce clean code by representing the full design
             * split in a verbose and communicative manner has failed. There are
             * too many exceptions and the final solution suffers readability
             * and fragile abstraction layers.
             * In result, the best suitable solution right now is a duplicate
             * rendering. The browser always hides away one version based on
             * container queries in the styling. This avoids to maintain the
             * rendering split in TypeScript too and relies on robust
             * web-browser mechanisms solely. Anyhow, the resulting code must be
             * maintained with care. Always being aware of the duplicated code
             * aspect that need to be maintained.
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
