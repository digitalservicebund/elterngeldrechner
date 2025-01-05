import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  type SyntheticEvent,
  forwardRef,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LebensmonatContent } from "./content";
import { ProvideInformationenZumLebensmonat } from "./informationenZumLebensmonat";
import { LebensmonatSummary } from "./summary";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
  Lebensmonat,
  Lebensmonatszahl,
} from "@/features/planer/domain";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
  WaehleOptionInLebensmonat,
} from "@/features/planer/user-interface/service/callbackTypes";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

interface Props<A extends Ausgangslage> {
  readonly ausgangslage: A;
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeitenFuerLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  readonly waehleOption: WaehleOptionInLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  readonly erstelleVorschlaegeFuerAngabeDesEinkommens: ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat<
    ElternteileByAusgangslage<A>
  >;
  readonly gebeEinkommenAn: GebeEinkommenInLebensmonatAn<
    ElternteileByAusgangslage<A>
  >;
  readonly className?: string;
}

export const LebensmonatDetails = forwardRef(function LebensmonatDetails<
  A extends Ausgangslage,
>(
  {
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
    bestimmeAuswahlmoeglichkeiten,
    waehleOption,
    erstelleVorschlaegeFuerAngabeDesEinkommens,
    gebeEinkommenAn,
    className,
  }: Props<A>,
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

  useOnClickOutside(detailsElement, () => {
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
    ausgangslage,
    lebensmonatszahl,
    lebensmonat,
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
}) as <A extends Ausgangslage>(
  props: Props<A> & { ref?: FocusOnlyRef },
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
