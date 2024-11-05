import { Fragment, ReactNode, useId } from "react";
import classNames from "classnames";
import { GewaehlteOption } from "./GewaehlteOption";
import { Haushaltseinkommen } from "./Haushaltseinkommen";
import { beschreibeLebensmonat } from "./beschreibeLebensmonat";
import { useInformationenZumLebensmonat } from "@/features/planer/user-interface/component/lebensmonat-details/informationenZumLebensmonat";
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
} from "@/features/planer/user-interface/service";

type Props = {
  readonly identifierToZeitraumLabel: string;
};

export function LebensmonatSummary({
  identifierToZeitraumLabel,
}: Props): ReactNode {
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

  const { lebensmonatszahl, lebensmonat, pseudonymeDerElternteile } =
    useInformationenZumLebensmonat();

  const ariaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const auswahlDescriptionIdentifier = useId();
  const auswahlDescription = beschreibeLebensmonat(
    lebensmonat,
    pseudonymeDerElternteile,
  );

  return (
    <summary
      className="list-none py-6 hover:bg-off-white focus:bg-off-white"
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
          <Haushaltseinkommen
            className="row-start-1 self-center justify-self-center"
            style={elterngeldbezugColumns[elternteil]}
            elterngeldbezug={monat.elterngeldbezug}
            bruttoeinkommen={monat.bruttoeinkommen}
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
