import { Fragment, ReactNode, useId } from "react";
import classNames from "classnames";
import { GewaehlteOption } from "./GewaehlteOption";
import { Elterngeldbezugsanzeige } from "./Elterngeldbezugsanzeige";
import {
  listeMonateAuf,
  Elternteil,
  type Lebensmonat,
  type PseudonymeDerElternteile,
  type Monat,
  type Lebensmonatszahl,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/formatAsCurrency";

type Props<E extends Elternteil> = {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly gridClassNames: GridClassNames<E>;
  readonly identifierForDetailsAriaLabel: string;
  readonly zeitraumIdentifierForAriaDescription: string;
};

export function LebensmonatSummary<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  gridClassNames,
  identifierForDetailsAriaLabel,
  zeitraumIdentifierForAriaDescription,
}: Props<E>): ReactNode {
  const descriptionIdentifier = useId();
  const description = composeDescription(lebensmonat, pseudonymeDerElternteile);

  return (
    <summary
      className={classNames(
        "relative py-6 hover:bg-off-white focus:bg-off-white",
        gridClassNames.template,
      )}
      aria-describedby={classNames(
        descriptionIdentifier,
        zeitraumIdentifierForAriaDescription,
      )}
    >
      <span id={descriptionIdentifier} className="sr-only" aria-hidden>
        {description}
      </span>

      <span
        id={identifierForDetailsAriaLabel}
        className={classNames(
          "self-center text-center font-bold",
          gridClassNames.areas.middle,
        )}
        aria-label={`${lebensmonatszahl}. Lebensmonat`}
      >
        {lebensmonatszahl}
      </span>

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => (
        <Fragment key={elternteil}>
          <Elterngeldbezugsanzeige
            className={classNames(
              "self-center justify-self-center",
              gridClassNames.areas[elternteil].elterngeldbezug,
            )}
            elterngeldbezug={monat.elterngeldbezug}
            imMutterschutz={monat.imMutterschutz}
            ariaHidden
          />

          <GewaehlteOption
            className={gridClassNames.areas[elternteil].gewaehlteOption}
            imMutterschutz={monat.imMutterschutz}
            option={monat.gewaehlteOption}
            ariaHidden
          />
        </Fragment>
      ))}
    </summary>
  );
}

function composeDescription<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
  pseudonymeDerElternteile: PseudonymeDerElternteile<E>,
): string {
  const keinElternteilHatEineAuswahlGetroffen = listeMonateAuf(
    lebensmonat,
  ).every(([, monat]) => monat.gewaehlteOption === undefined);

  return keinElternteilHatEineAuswahlGetroffen
    ? "Noch keine Auswahl getätigt."
    : listeMonateAuf(lebensmonat)
        .map(([elternteil, monat]) =>
          composeDescriptionForAuswahl(
            monat,
            pseudonymeDerElternteile[elternteil],
          ),
        )
        .join(". ")
        .concat(".");
}

function composeDescriptionForAuswahl(monat: Monat, pseudonym: string): string {
  if (monat.imMutterschutz) {
    return `${pseudonym} ist im Mutterschutz`;
  } else if (monat.gewaehlteOption) {
    if (monat.elterngeldbezug) {
      return `${pseudonym} bezieht ${monat.gewaehlteOption} und erhält ${formatAsCurrency(monat.elterngeldbezug)}`;
    } else {
      return `${pseudonym} bezieht ${monat.gewaehlteOption}`;
    }
  } else {
    return `${pseudonym} hat noch keine Auswahl getroffen`;
  }
}

type GridClassNames<E extends Elternteil> = {
  template: string;
  areas: { middle: string } & Record<E, GridAreasForElternteil>;
};

type GridAreasForElternteil = {
  elterngeldbezug: string;
  gewaehlteOption: string;
};
