import { Fragment, ReactNode, useId } from "react";
import classNames from "classnames";
import { GewaehlteOption } from "./GewaehlteOption";
import { Elterngeldbezugsanzeige } from "./Elterngeldbezugsanzeige";
import {
  useGridLayout,
  useGridColumn,
  useGridColumnPerElternteil,
  type GridColumnDefinitionPerElternteil,
  type GridColumnDefinition,
} from "@/features/planer/user-interface/layout/grid-layout";
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
  readonly identifierToZeitraumLabel: string;
};

export function LebensmonatSummary<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  identifierToZeitraumLabel,
}: Props<E>): ReactNode {
  const gridLayout = useGridLayout();
  const lebensmonatszahlColumns = useGridColumn(
    LEBENSMONATSZAHL_COLUMN_DEFINITION,
  );
  const elterngeldbezugColumns = useGridColumnPerElternteil(
    ELTERNBGELDBEZUG_COLUMN_DEFINITIONS,
  );
  const gewaehlteOptionColumns = useGridColumnPerElternteil(
    GEWAEHLTE_OPTION_COLUMN_DEFINITIONS,
  );

  const ariaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const auswahlDescriptionIdentifier = useId();
  const auswahlDescription = composeAuswahlDescription(
    lebensmonat,
    pseudonymeDerElternteile,
  );

  return (
    <summary
      className="relative py-6 hover:bg-off-white focus:bg-off-white"
      style={gridLayout}
      aria-label={ariaLabel}
      aria-describedby={classNames(
        auswahlDescriptionIdentifier,
        identifierToZeitraumLabel,
      )}
    >
      <span id={auswahlDescriptionIdentifier} className="sr-only" aria-hidden>
        {auswahlDescription}
      </span>

      <span
        className="self-center text-center font-bold"
        style={lebensmonatszahlColumns}
        aria-hidden
      >
        {lebensmonatszahl}
      </span>

      {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => (
        <Fragment key={elternteil}>
          <Elterngeldbezugsanzeige
            className="row-start-1 self-center justify-self-center"
            style={elterngeldbezugColumns[elternteil]}
            elterngeldbezug={monat.elterngeldbezug}
            imMutterschutz={monat.imMutterschutz}
            ariaHidden
          />

          <GewaehlteOption
            className="row-start-1"
            style={gewaehlteOptionColumns[elternteil]}
            imMutterschutz={monat.imMutterschutz}
            option={monat.gewaehlteOption}
            ariaHidden
          />
        </Fragment>
      ))}
    </summary>
  );
}

function composeAuswahlDescription<E extends Elternteil>(
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

const LEBENSMONATSZAHL_COLUMN_DEFINITION: GridColumnDefinition = {
  1: "left-outside",
  2: "middle",
};

const ELTERNBGELDBEZUG_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["right-middle", "right-outside"],
  },
  2: {
    [Elternteil.Eins]: ["et1-outside", "et1-middle"],
    [Elternteil.Zwei]: ["et2-middle", "et2-outside"],
  },
};

const GEWAEHLTE_OPTION_COLUMN_DEFINITIONS: GridColumnDefinitionPerElternteil = {
  1: {
    [Elternteil.Eins]: ["left-inside", "right-inside"],
  },
  2: {
    [Elternteil.Eins]: "et1-inside",
    [Elternteil.Zwei]: "et2-inside",
  },
};
