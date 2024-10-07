import {
  forwardRef,
  ReactNode,
  useId,
  useImperativeHandle,
  useRef,
  useState,
  type ForwardedRef,
  type SyntheticEvent,
} from "react";
import classNames from "classnames";
import { LebensmonatSummary } from "./summary";
import { LebensmonatContent } from "./content";
import { ProvideInformationenZumLebensmonat } from "./informationenZumLebensmonat";
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
} from "@/features/planer/user-interface/service";
import { useDetectClickOutside } from "@/hooks/useDetectMouseEventOutside";

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

  const detailsElement = useRef<HTMLDetailsElement>(null);
  useImperativeHandle(
    ref,
    () => ({
      focus: () => detailsElement.current?.querySelector("summary")?.focus(),
    }),
    [detailsElement],
  );

  useDetectClickOutside(detailsElement, () => {
    if (detailsElement.current != null) {
      detailsElement.current.open = false;
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);
  function toggleExpandedState(
    event: SyntheticEvent<HTMLDetailsElement, ToggleEvent>,
  ) {
    setIsExpanded(event.nativeEvent.newState === "open");
  }

  const informationenZumLebensmonat = {
    lebensmonatszahl,
    lebensmonat,
    pseudonymeDerElternteile,
    geburtsdatumDesKindes,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    gebeEinkommenAn,
  };

  return (
    <ProvideInformationenZumLebensmonat
      informationen={informationenZumLebensmonat}
    >
      <details
        className={classNames("group open:bg-off-white", className)}
        name="Lebensmonate"
        aria-label={detailsAriaLabel}
        ref={detailsElement}
        onToggle={toggleExpandedState}
      >
        <LebensmonatSummary
          identifierToZeitraumLabel={zeitraumLabelIdentifier}
        />

        {
          /* Performance optimization */
          !!isExpanded && (
            <LebensmonatContent
              zeitraumLabelIdentifier={zeitraumLabelIdentifier}
            />
          )
        }
      </details>
    </ProvideInformationenZumLebensmonat>
  );
}) as <E extends Elternteil>(
  props: Props<E> & { ref?: FocusOnlyRef },
) => ReactNode;

type FocusOnlyRef = ForwardedRef<{ focus: () => void }>;
