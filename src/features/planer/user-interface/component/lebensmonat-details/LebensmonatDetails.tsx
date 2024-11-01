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
  ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat,
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
  readonly erstelleVorschlaegeFuerAngabeDesEinkommens: ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat<E>;
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
    erstelleVorschlaegeFuerAngabeDesEinkommens,
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
  function onToggleListener(
    event: SyntheticEvent<HTMLDetailsElement, ToggleEvent>,
  ) {
    const isExpandedNext = isExpandedFromToggleEvent(
      event.nativeEvent,
      isExpanded,
    );

    setIsExpanded(isExpandedNext);

    if (isExpandedNext) {
      detailsElement.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    }
  }

  const informationenZumLebensmonat = {
    lebensmonatszahl,
    lebensmonat,
    pseudonymeDerElternteile,
    geburtsdatumDesKindes,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
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
        onToggle={onToggleListener}
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

/**
 * Determines if a component that emitted a {@link ToggleEvent} is in an
 * expanded state or not.
 *
 * This method fixes the access to the {@link ToggleEvent.prototype.newState}
 * property, which is used to determine the state. Certain web-browsers seam not
 * to support these kind of events fully yet.
 * As fallback, the last known expanded state is just toggled. It is expected
 * that some internal state backs this parameter and keeps it synced. Toggle
 * events by the same components are expected to always switch between expanded
 * and not expanded (or rather `"open"` and `"close"`).
 */
function isExpandedFromToggleEvent(
  event: ToggleEvent,
  isExpandedNow: boolean,
): boolean {
  const { newState } = event;
  const eventSupportsState = typeof newState === "string";
  return eventSupportsState ? newState === "open" : !isExpandedNow;
}
