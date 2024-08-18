import { Fragment, ReactNode } from "react";
import classNames from "classnames";
import ExpandMoreIcon from "@digitalservicebund/icons/ExpandMore";
import ExpandLessIcon from "@digitalservicebund/icons/ExpandLess";
import {
  GRID_TEMPLATE_CLASS_NAMES,
  PLACE_ITEM_CLASS_NAMES,
  PlACE_ITEM_MIDDLE_CLASS_NAME,
} from "./grid-areas";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";
import { Elterngeldbezugsanzeige } from "@/features/planer/user-interface/component/Elterngeldbezugsanzeige";
import { GewaehlteOption } from "@/features/planer/user-interface/component/GewaehlteOption";
import { AuswahlEingabe } from "@/features/planer/user-interface/component/AuswahlEingabe";
import {
  Elternteil,
  type Lebensmonatszahl,
  type Lebensmonat,
  listeMonateAuf,
} from "@/features/planer/user-interface/service";

interface Props<E extends Elternteil> {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
  readonly className?: string;
}

export function LebensmonatDetails<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  className,
}: Props<E>): ReactNode {
  const anzahlElternteile = Object.keys(lebensmonat).length;
  const gridTemplateClassName = GRID_TEMPLATE_CLASS_NAMES[anzahlElternteile];

  return (
    <details
      className={classNames("group open:bg-off-white", className)}
      name="Lebensmonate"
      aria-label={`${lebensmonatszahl}. Lebensmonat`}
    >
      <summary
        className={classNames(
          "relative py-6 hover:cursor-pointer hover:bg-off-white",
          gridTemplateClassName,
        )}
        data-testid="summary"
      >
        <span
          className={classNames(
            "self-center text-center font-bold",
            PlACE_ITEM_MIDDLE_CLASS_NAME,
          )}
        >
          {lebensmonatszahl}
          <span className="sr-only">. Lebensmonat</span>
        </span>

        {listeMonateAuf(lebensmonat)
          .sort(sortByElternteilKey)
          .map(([elternteil, monat]) => (
            <Fragment key={elternteil}>
              <Elterngeldbezugsanzeige
                className={classNames(
                  "self-center justify-self-center",
                  PLACE_ITEM_CLASS_NAMES[elternteil].outside,
                )}
                elterngeldbezug={monat.elterngeldbezug}
                imMutterschutz={monat.imMutterschutz}
              />

              <GewaehlteOption
                className={PLACE_ITEM_CLASS_NAMES[elternteil].inside}
                imMutterschutz={monat.imMutterschutz}
                option={monat.gewaehlteOption}
              />
            </Fragment>
          ))}

        <ExpandMoreIcon
          className={classNames(
            TOGGLE_STATE_ICON_CLASS_NAME,
            "group-open:hidden",
          )}
        />

        <ExpandLessIcon
          className={classNames(
            TOGGLE_STATE_ICON_CLASS_NAME,
            "hidden group-open:block",
          )}
        />
      </summary>

      <div
        className={classNames("py-20 px-10", gridTemplateClassName)}
        data-testid="details-body"
      >
        {listeMonateAuf(lebensmonat)
          .sort(sortByElternteilKey)
          .map(([elternteil, monat]) => {
            // TODO: Use name of Elternteil
            const legend = `Auswahloptionen im Lebensmonat ${lebensmonatszahl} für ${elternteil}`;
            const auswahlmoeglichkeiten =
              bestimmeAuswahlmoeglichkeiten(elternteil);
            const showDisabledHintRight = elternteil === Elternteil.Zwei;

            return (
              <AuswahlEingabe
                key={elternteil}
                className={PLACE_ITEM_CLASS_NAMES[elternteil].full}
                legend={legend}
                auswahlmoeglichkeiten={auswahlmoeglichkeiten}
                gewaehlteOption={monat.gewaehlteOption}
                waehleOption={waehleOption.bind(null, elternteil)}
                showDisabledHintRight={showDisabledHintRight}
              />
            );
          })}
      </div>
    </details>
  );
}

function sortByElternteilKey(
  [left]: [Elternteil, any],
  [right]: [Elternteil, any],
): number {
  return ELTERNTEIL_SORT_RANK[left] - ELTERNTEIL_SORT_RANK[right];
}

const ELTERNTEIL_SORT_RANK: Record<Elternteil, number> = {
  [Elternteil.Eins]: 1,
  [Elternteil.Zwei]: 1,
};

const TOGGLE_STATE_ICON_CLASS_NAME =
  "min-h-24 min-w-24 absolute right-8 top-1/2 -translate-y-1/2";
