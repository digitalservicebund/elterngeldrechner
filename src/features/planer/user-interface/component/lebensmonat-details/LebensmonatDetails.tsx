import {
  forwardRef,
  ReactNode,
  useId,
  useImperativeHandle,
  type ForwardedRef,
  type RefObject,
} from "react";
import classNames from "classnames";
import { useDetectClickOutside } from "react-detect-click-outside";
import gridClassNames from "./grid.module.css";
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

export const LebensmonatDetails = forwardRef(function LebensmonatDetails<
  E extends Elternteil,
>(
  {
    lebensmonatszahl,
    lebensmonat,
    pseudonymeDerElternteile,
    geburtsdatumDesKindes,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    className,
  }: Props<E>,
  ref?: FocusOnlyRef,
): ReactNode {
  const anzahlElternteile = Object.keys(lebensmonat).length;
  const gridLayoutTemplateClassName = GRID_LAYOUT_TEMPLATES[anzahlElternteile];

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

  useImperativeHandle(
    ref,
    () => ({
      focus: () => detailsElement.current?.querySelector("summary")?.focus(),
    }),
    [detailsElement],
  );

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
        identifierForDetailsAriaLabel={detailsAriaLabelIdentifier}
        zeitraumIdentifierForAriaDescription={zeitraumLabelIdentifier}
        gridLayout={{
          templateClassName: gridLayoutTemplateClassName,
          areaClassNames: GRID_LAYOUT_SUMMARY_AREA_CLASS_NAMES,
        }}
      />

      <LebensmonatContent
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        zeitraum={zeitraum}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        waehleOption={waehleOption}
        gridLayout={{
          templateClassName: gridLayoutTemplateClassName,
          areaClassNames: GRID_LAYOUT_CONTENT_AREA_CLASS_NAMES,
        }}
        identifierForSummaryAriaDescription={zeitraumLabelIdentifier}
      />
    </details>
  );
}) as <E extends Elternteil>(
  props: Props<E> & { ref?: FocusOnlyRef },
) => ReactNode;

const GRID_LAYOUT_TEMPLATES: {
  [numberOfElternteile: number]: string;
} = {
  1: gridClassNames.gridTemplateForSingleElternteil,
  2: gridClassNames.gridTemplateForTwoElternteile,
};

const GRID_LAYOUT_SUMMARY_AREA_CLASS_NAMES = {
  lebensmonatszahl: gridClassNames.areaSummaryLebensmonatszahl,
  [Elternteil.Eins]: {
    elterngeldbezug: gridClassNames.areaSummaryEt1Elterngeldbezug,
    gewaehlteOption: gridClassNames.areaSummaryEt1GewaehlteOption,
  },
  [Elternteil.Zwei]: {
    elterngeldbezug: gridClassNames.areaSummaryEt2Elterngeldbezug,
    gewaehlteOption: gridClassNames.areaSummaryEt2GewaehlteOption,
  },
};

const GRID_LAYOUT_CONTENT_AREA_CLASS_NAMES = {
  zeitraum: gridClassNames.areaContentZeitraum,
  hinweisZumBonus: gridClassNames.areaContentHinweisZumBonus,
  [Elternteil.Eins]: {
    auswahl: {
      fieldset: gridClassNames.areaContentEt1AuswahlFieldset,
      info: gridClassNames.areaContentEt1AuswahlInfo,
      input: gridClassNames.areaContentEt1AuswahlInput,
    },
  },
  [Elternteil.Zwei]: {
    auswahl: {
      fieldset: gridClassNames.areaContentEt2AuswahlFieldset,
      info: gridClassNames.areaContentEt2AuswahlInfo,
      input: gridClassNames.areaContentEt2AuswahlInput,
    },
  },
};

type FocusOnlyRef = ForwardedRef<{ focus: () => void }>;
