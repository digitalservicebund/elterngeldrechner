import classNames from "classnames";
import {
  type ForwardedRef,
  ReactNode,
  type SyntheticEvent,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { LebensmonatContent } from "./content";
import { ProvideInformationenZumLebensmonat } from "./informationenZumLebensmonat";
import { LebensmonatSummary } from "./summary";
import type {
  BestimmeAuswahlmoeglichkeitenFuerLebensmonat,
  ErstelleVorschlaegeFuerAngabeDesEinkommensFuerLebensmonat,
  GebeEinkommenInLebensmonatAn,
  WaehleOptionInLebensmonat,
} from "@/application/features/planer/service/callbackTypes";
import { useOnClickOutside } from "@/application/hooks/useOnClickOutside";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
  Lebensmonat,
  Lebensmonatszahl,
} from "@/monatsplaner";

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
  readonly onToggle?: (event: ToggleEvent) => void;
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
    onToggle,
    className,
  }: Props<A>,
  ref?: ForwardedRef<HTMLDetailsElement | null>,
): ReactNode {
  const detailsAriaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const detailsElement = useRef<HTMLDetailsElement>(null);

  useImperativeHandle<
    HTMLDetailsElement | null,
    HTMLDetailsElement | null
  >(ref, () => {
    if (detailsElement.current === null) {
      return null;
    } else {
      const focusSummary = () =>
        detailsElement.current?.querySelector("summary")?.focus();

      return {
        ...detailsElement.current,
        focus: focusSummary,
      };
    }
  }, [detailsElement]);

  useOnClickOutside(detailsElement, () => {
    if (detailsElement.current != null) {
      detailsElement.current.open = false;
    }
  });

  const [isExpanded, setIsExpanded] = useState(false);
  function onToggleListener(
    event: SyntheticEvent<HTMLDetailsElement, ToggleEvent>,
  ) {
    const fixedEvent = fixToggleEvent(event.nativeEvent, isExpanded);
    const isExpandedNext = fixedEvent.newState === "open";

    setIsExpanded(isExpandedNext);

    if (isExpandedNext) {
      detailsElement.current?.scrollIntoView({
        block: "nearest",
        behavior: "instant",
      });
    }

    onToggle?.(fixedEvent);
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
        <LebensmonatSummary />

        {
          /* Performance optimization */
          !!isExpanded && <LebensmonatContent />
        }
      </details>
    </ProvideInformationenZumLebensmonat>
  );
}) as <A extends Ausgangslage>(
  props: Props<A> & { ref?: ForwardedRef<HTMLDetailsElement | null> },
) => ReactNode;

/**
 * This method fixes the access to the {@link ToggleEvent.prototype.newState}
 * and {@link ToggleEvent.prototype.oldState} properties. Some web-browsers do
 * not support this kind of event fully yet.
 *
 * As fallback, the last known state is just toggled. It is expected that some
 * internal state backs this parameter and keeps it synced. Toggle events by the
 * same components are expected to always switch between expanded and not
 * expanded (or rather `"open"` and `"close"`).
 */
function fixToggleEvent(
  event: ToggleEvent,
  isExpandedNow: boolean,
): ToggleEvent {
  const hasStateProperties =
    typeof event.newState === "string" && typeof event.oldState === "string";

  if (hasStateProperties) {
    return event;
  } else {
    return new ToggleEvent(event.type, {
      newState: isExpandedNow ? "closed" : "open",
      oldState: isExpandedNow ? "open" : "closed",
    });
  }
}
