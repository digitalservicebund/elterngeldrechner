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
  readonly identifierForDetailsAriaLabel: string;
  readonly zeitraumIdentifierForAriaDescription: string;
  readonly gridLayout: GridLayout<E>;
};

export function LebensmonatSummary<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  identifierForDetailsAriaLabel,
  zeitraumIdentifierForAriaDescription,
  gridLayout,
}: Props<E>): ReactNode {
  const descriptionIdentifier = useId();
  const description = composeDescription(lebensmonat, pseudonymeDerElternteile);

  return (
    <summary
      className={classNames(
        "relative py-6 hover:bg-off-white focus:bg-off-white",
        gridLayout.templateClassName,
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
          gridLayout.areaClassNames.lebensmonatszahl,
        )}
        aria-label={`${lebensmonatszahl}. Lebensmonat`}
      >
        {lebensmonatszahl}
      </span>

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => (
        <Fragment key={elternteil}>
          <Elterngeldbezugsanzeige
            className={classNames(
              "row-start-1 self-center justify-self-center",
              gridLayout.areaClassNames[elternteil].elterngeldbezug,
            )}
            elterngeldbezug={monat.elterngeldbezug}
            imMutterschutz={monat.imMutterschutz}
            ariaHidden
          />

          <GewaehlteOption
            className={classNames(
              "row-start-1",
              gridLayout.areaClassNames[elternteil].gewaehlteOption,
            )}
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
  const isSingleElternteil = Object.keys(lebensmonat).length === 1;
  const keinElternteilHatEineAuswahlGetroffen = listeMonateAuf(
    lebensmonat,
  ).every(([, monat]) => monat.gewaehlteOption === undefined);

  return keinElternteilHatEineAuswahlGetroffen
    ? "Noch keine Auswahl getroffen."
    : listeMonateAuf(lebensmonat)
        .map(([elternteil, monat]) =>
          composeDescriptionForAuswahl(
            monat,
            pseudonymeDerElternteile[elternteil],
            isSingleElternteil,
          ),
        )
        .join(". ")
        .concat(".");
}

function composeDescriptionForAuswahl(
  monat: Monat,
  pseudonym: string,
  isSingleElternteil: boolean,
): string {
  if (monat.imMutterschutz) {
    return isSingleElternteil
      ? "Sie sind im Mutterschutz"
      : `${pseudonym} ist im Mutterschutz`;
  }

  if (monat.gewaehlteOption) {
    if (monat.elterngeldbezug) {
      return isSingleElternteil
        ? `Sie beziehen ${monat.gewaehlteOption} und erhalten ${formatAsCurrency(monat.elterngeldbezug)}`
        : `${pseudonym} bezieht ${monat.gewaehlteOption} und erhält ${formatAsCurrency(monat.elterngeldbezug)}`;
    }

    return isSingleElternteil
      ? `Sie beziehen ${monat.gewaehlteOption}`
      : `${pseudonym} bezieht ${monat.gewaehlteOption}`;
  }

  return isSingleElternteil
    ? "Noch keine Auswahl getroffen"
    : `${pseudonym} hat noch keine Auswahl getroffen`;
}

type GridLayout<E extends Elternteil> = {
  templateClassName: string;
  areaClassNames: { lebensmonatszahl: string } & Record<
    E,
    GridAreasForElternteil
  >;
};

type GridAreasForElternteil = {
  elterngeldbezug: string;
  gewaehlteOption: string;
};
