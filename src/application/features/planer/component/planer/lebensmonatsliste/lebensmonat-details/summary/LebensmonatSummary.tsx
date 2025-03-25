import { type AriaAttributes, Fragment, ReactNode, useId } from "react";
import { GewaehlteOption } from "./GewaehlteOption";
import { Haushaltseinkommen } from "./Haushaltseinkommen";
import {
  beschreibePlanungImLebensmonat,
  beschreibeZeitraumDesLebensmonats,
} from "./beschreibeLebensmonat";
import { useInformationenZumLebensmonat } from "@/application/features/planer/component/planer/lebensmonatsliste/lebensmonat-details/informationenZumLebensmonat";
import {
  type GridColumnDefinition,
  type GridColumnDefinitionPerElternteil,
  useGridColumn,
  useGridColumnPerElternteil,
  useGridLayout,
} from "@/application/features/planer/layout";
import {
  Elternteil,
  listeElternteileFuerAusgangslageAuf,
} from "@/monatsplaner";

export function LebensmonatSummary(): ReactNode {
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

  const { ausgangslage, lebensmonatszahl, lebensmonat } =
    useInformationenZumLebensmonat();

  const ariaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const descriptionIdentifier = useId();
  const auswahlDescription = beschreibePlanungImLebensmonat(
    ausgangslage,
    lebensmonat,
  );
  const zeitraumDescription = beschreibeZeitraumDesLebensmonats(
    ausgangslage,
    lebensmonatszahl,
  );

  return (
    <summary
      className="list-none py-6 hover:bg-off-white focus:bg-off-white"
      style={gridLayout}
      aria-label={ariaLabel}
      aria-describedby={descriptionIdentifier}
      {...ATTRIBUTES_TO_FIX_SCREEN_READER}
    >
      <span id={descriptionIdentifier} className="sr-only" aria-hidden>
        {auswahlDescription} {zeitraumDescription}
      </span>

      <span
        className="self-center text-center font-bold"
        style={lebensmonatszahlColumns}
        aria-hidden
      >
        {lebensmonatszahl}
      </span>

      {listeElternteileFuerAusgangslageAuf(ausgangslage).map((elternteil) => {
        const {
          gewaehlteOption,
          elterngeldbezug,
          bruttoeinkommen,
          imMutterschutz,
        } = lebensmonat[elternteil];

        return (
          <Fragment key={elternteil}>
            <Haushaltseinkommen
              className="row-start-1 self-center justify-self-center"
              style={elterngeldbezugColumns[elternteil]}
              elterngeldbezug={elterngeldbezug}
              bruttoeinkommen={bruttoeinkommen}
              imMutterschutz={imMutterschutz}
              ariaHidden
            />

            <GewaehlteOption
              className="row-start-1"
              style={gewaehlteOptionColumns[elternteil]}
              imMutterschutz={imMutterschutz}
              option={gewaehlteOption}
              ariaHidden
            />
          </Fragment>
        );
      })}
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

/**
 * There is an issue using screen reader with certain web-browsers (Firefox is
 * known to have issues while writing this.). When the Plan changes, the
 * description for the respective Lebensmonate updates. This also applies for
 * the accessible description. But it won't always be picked up by screen
 * readers. Instead, the initial state will be read.
 *
 * This is rather a hack than a proper fix. It tricks the web-browser to
 * properly pick up the changes and communicate it to the screen reader.
 */
const ATTRIBUTES_TO_FIX_SCREEN_READER: AriaAttributes = {
  ["aria-live"]: "polite", // force web-browser to be attentive to changes
  ["aria-busy"]: true, // suppress automatic announcements on changes
};
