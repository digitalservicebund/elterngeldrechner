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
import { LebensmonatContent } from "./LebensmonatContent";
import { LebensmonatSummary } from "./LebensmonatSummary";
import {
  type BestimmeAuswahlmoeglichkeiten,
  type ErstelleVorschlaegeFuerAngabeDesEinkommens,
  type GebeEinkommenAn,
  ProvideInformationenZumLebensmonat,
  type WaehleOption,
} from "./informationenZumLebensmonat";
import { useOnClickOutside } from "@/application/hooks/useOnClickOutside";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
  Lebensmonat,
  Lebensmonatszahl,
} from "@/monatsplaner";

export interface LebensmonatDetailsHTMLElement extends HTMLDetailsElement {
  openSummary: () => void;
}

type Props<A extends Ausgangslage> = {
  readonly ausgangslage: A;
  readonly lebensmonatszahl: Lebensmonatszahl;
  readonly lebensmonat: Lebensmonat<ElternteileByAusgangslage<A>>;
  readonly bestimmeAuswahlmoeglichkeiten: BestimmeAuswahlmoeglichkeiten<A>;
  readonly waehleOption: WaehleOption<A>;
  readonly erstelleVorschlaegeFuerAngabeDesEinkommens: ErstelleVorschlaegeFuerAngabeDesEinkommens<A>;
  readonly gebeEinkommenAn: GebeEinkommenAn<A>;
  readonly ergaenzeBruttoeinkommenFuerPartnerschaftsbonus: () => void;
  readonly onToggle?: (event: ToggleEvent) => void;
  readonly className?: string;
};

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
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
    onToggle,
    className,
  }: Props<A>,
  ref: ForwardedRef<LebensmonatDetailsHTMLElement>,
): ReactNode {
  const detailsAriaLabel = `${lebensmonatszahl}. Lebensmonat`;

  const detailsElement = useRef<LebensmonatDetailsHTMLElement>(null);

  useImperativeHandle(ref, () => {
    const current = detailsElement.current;
    if (!current) throw new Error("detailsElement is not mounted");

    const focusSummary = () => current.querySelector("summary")?.focus();

    const openSummary = () => {
      current.open = true;

      toggleDetailsElement(true);
    };

    return {
      ...current,
      focus: focusSummary,
      openSummary: openSummary,
    };
  }, []);

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

    toggleDetailsElement(isExpandedNext);

    onToggle?.(fixedEvent);
  }

  function toggleDetailsElement(isExpandedNext: boolean) {
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
    ergaenzeBruttoeinkommenFuerPartnerschaftsbonus,
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
  props: Props<A> & { ref: ForwardedRef<LebensmonatDetailsHTMLElement> },
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
