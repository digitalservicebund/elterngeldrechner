import { Fragment, ReactNode, useId } from "react";
import classNames from "classnames";
import {
  GRID_TEMPLATE_CLASS_NAMES,
  PLACE_ITEM_CLASS_NAMES,
  PlACE_ITEM_MIDDLE_CLASS_NAME,
  PLACE_ITEM_FULL_WIDTH_CLASS_NAME,
} from "./grid-areas";
import { HinweisZumBonus } from "@/features/planer/user-interface/component/HinweisZumBonus";
import { ZeitraumLabel } from "@/features/planer/user-interface/component/ZeitraumLabel";
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
  type PseudonymeDerElternteile,
  berechneZeitraumFuerLebensmonat,
  AlleElternteileHabenBonusGewaehlt,
  type Monat,
} from "@/features/planer/user-interface/service";
import { formatAsCurrency } from "@/utils/locale-formatting";

interface Props<E extends Elternteil> {
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<E>;
  readonly pseudonymeDerElternteile: PseudonymeDerElternteile<E>;
  readonly geburtsdatumDesKindes: Date;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<E>;
  readonly waehleOption: WaehleOptionInLebensmonat<E>;
  readonly className?: string;
}

export function LebensmonatDetails<E extends Elternteil>({
  lebensmonatszahl,
  lebensmonat,
  pseudonymeDerElternteile,
  geburtsdatumDesKindes,
  bestimmeAuswahlmoeglichkeiten,
  waehleOption,
  className,
}: Props<E>): ReactNode {
  const anzahlElternteile = Object.keys(lebensmonat).length;
  const gridTemplateClassName = GRID_TEMPLATE_CLASS_NAMES[anzahlElternteile];

  const zeitraumLabelIdentifier = useId();
  const zeitraum = berechneZeitraumFuerLebensmonat(
    geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  const isBonusHintVisible =
    AlleElternteileHabenBonusGewaehlt.asPredicate(lebensmonat);

  const descriptionIdentifier = useId();
  const description = composeDescription(lebensmonat, pseudonymeDerElternteile);

  const labelIdentifier = useId();

  return (
    <details
      className={classNames("group open:bg-off-white", className)}
      name="Lebensmonate"
      aria-labelledby={labelIdentifier}
    >
      <summary
        className={classNames(
          "relative py-6 hover:bg-off-white focus:bg-off-white",
          gridTemplateClassName,
        )}
        aria-describedby={classNames(
          descriptionIdentifier,
          zeitraumLabelIdentifier,
        )}
      >
        <span id={descriptionIdentifier} className="sr-only" aria-hidden>
          {description}
        </span>

        <span
          id={labelIdentifier}
          className={classNames(
            "self-center text-center font-bold",
            PlACE_ITEM_MIDDLE_CLASS_NAME,
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
                PLACE_ITEM_CLASS_NAMES[elternteil].outside,
              )}
              elterngeldbezug={monat.elterngeldbezug}
              imMutterschutz={monat.imMutterschutz}
              ariaHidden
            />

            <GewaehlteOption
              className={PLACE_ITEM_CLASS_NAMES[elternteil].inside}
              imMutterschutz={monat.imMutterschutz}
              option={monat.gewaehlteOption}
              ariaHidden
            />
          </Fragment>
        ))}
      </summary>

      <div className={classNames("px-10 pb-20 pt-8", gridTemplateClassName)}>
        <ZeitraumLabel
          id={zeitraumLabelIdentifier}
          className={classNames(
            "mb-24 text-center",
            PLACE_ITEM_FULL_WIDTH_CLASS_NAME,
          )}
          zeitraum={zeitraum}
          prefix="Zeitraum"
        />

        {listeMonateAuf(lebensmonat, true).map(([elternteil, monat]) => {
          const pseudonym = pseudonymeDerElternteile[elternteil];
          const legend = `Auswahl von ${pseudonym} für den ${lebensmonatszahl}. Lebensmonat`;
          const auswahlmoeglichkeiten =
            bestimmeAuswahlmoeglichkeiten(elternteil);
          const showDisabledHintRight =
            anzahlElternteile == 1 || elternteil === Elternteil.Zwei;

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

        {!!isBonusHintVisible && (
          <HinweisZumBonus
            className={PLACE_ITEM_FULL_WIDTH_CLASS_NAME}
            hasMultipleElternteile={anzahlElternteile > 1}
          />
        )}
      </div>
    </details>
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
