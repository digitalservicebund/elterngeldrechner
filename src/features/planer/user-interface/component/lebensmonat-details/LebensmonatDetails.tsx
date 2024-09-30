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
import { LebensmonatSummary } from "./summary";
import { LebensmonatContent } from "./content";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
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
  readonly gebeEinkommenAn: GebeEinkommenInLebensmonatAn<E>;
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
    gebeEinkommenAn,
    className,
  }: Props<E>,
  ref?: FocusOnlyRef,
): ReactNode {
  const detailsAriaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const zeitraumLabelIdentifier = useId();
  const zeitraum = berechneZeitraumFuerLebensmonat(
    geburtsdatumDesKindes,
    lebensmonatszahl,
  );

  const detailsElement: RefObject<HTMLDetailsElement> = useDetectClickOutside({
    disableTouch: true,
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
      aria-label={detailsAriaLabel}
      ref={detailsElement}
    >
      <LebensmonatSummary
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        identifierToZeitraumLabel={zeitraumLabelIdentifier}
      />

      <LebensmonatContent
        lebensmonatszahl={lebensmonatszahl}
        lebensmonat={lebensmonat}
        pseudonymeDerElternteile={pseudonymeDerElternteile}
        zeitraum={zeitraum}
        zeitraumLabelIdentifier={zeitraumLabelIdentifier}
        bestimmeAuswahlmoeglichkeiten={bestimmeAuswahlmoeglichkeiten}
        waehleOption={waehleOption}
        gebeEinkommenAn={gebeEinkommenAn}
      />
    </details>
  );
}) as <E extends Elternteil>(
  props: Props<E> & { ref?: FocusOnlyRef },
) => ReactNode;

type FocusOnlyRef = ForwardedRef<{ focus: () => void }>;
