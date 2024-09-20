import { ReactNode, useId, type RefObject } from "react";
import classNames from "classnames";
import { useDetectClickOutside } from "react-detect-click-outside";
import {
  GridTemplates,
  GridAreasForContent,
  GridAreasForSummary,
} from "./grid-areas";
import { LebensmonatSummary } from "./summary";
import { LebensmonatContent } from "./content";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";
import {
  Elternteil,
  type Lebensmonatszahl,
  type Lebensmonat,
  type PseudonymeDerElternteile,
  berechneZeitraumFuerLebensmonat,
} from "@/features/planer/user-interface/service";

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
  const gridTemplateClassName = GridTemplates[anzahlElternteile];

  const zeitraumLabelIdentifier = useId();
  const zeitraum = berechneZeitraumFuerLebensmonat(
    geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  const detailsAriaLabelIdentifier = useId();
  const detailsElement: RefObject<HTMLDetailsElement> = useDetectClickOutside({
    onTriggered: function closeDetails() {
      if (detailsElement.current != null) {
        detailsElement.current.open = false;
      }
    },
  });

  return (
    <details
      className={classNames("group open:bg-off-white", className)}
      name="Lebensmonate"
      aria-labelledby={detailsAriaLabelIdentifier}
      ref={detailsElement}
    >
      <LebensmonatSummary
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        gridClassNames={{
          template: gridTemplateClassName,
          areas: GridAreasForSummary,
        }}
        identifierForDetailsAriaLabel={detailsAriaLabelIdentifier}
        zeitraumIdentifierForAriaDescription={zeitraumLabelIdentifier}
      />

      <LebensmonatContent
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        zeitraum={zeitraum}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        waehleOption={waehleOption}
        gridClassNames={{
          template: gridTemplateClassName,
          areas: GridAreasForContent,
        }}
        identifierForSummaryAriaDescription={zeitraumLabelIdentifier}
      />
    </details>
  );
}
