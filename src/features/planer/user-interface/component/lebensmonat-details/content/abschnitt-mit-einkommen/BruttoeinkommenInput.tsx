import classNames from "classnames";
import {
  ReactNode,
  useId,
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import BusinessCenterIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import type { Einkommen } from "@/features/planer/user-interface/service";

type Props = {
  readonly bruttoeinkommen?: Einkommen;
  readonly ariaLabel: string;
  readonly gebeEinkommenAn: (bruttoeinkommen: number) => void;
  readonly style?: CSSProperties;
};

export function BruttoeinkommenInput({
  bruttoeinkommen,
  ariaLabel,
  gebeEinkommenAn,
  style,
}: Props): ReactNode {
  const inputIdentifier = useId();

  function filterNonNumbericInput(event: KeyboardEvent<HTMLInputElement>) {
    const isNumber = event.key.match(/[0-9]/) != null;
    const isSpecialKey = SPECIAL_INPUT_KEYS.includes(event.key);
    const shouldFilter = !isNumber && !isSpecialKey;
    if (shouldFilter) event.preventDefault();
  }

  function gebeBruttoeinkommenAn(event: ChangeEvent<HTMLInputElement>) {
    const bruttoeinkommen = Number.parseInt(event.target.value);
    gebeEinkommenAn(bruttoeinkommen);
  }

  return (
    <div className="flex flex-col gap-4" style={style}>
      <label htmlFor={inputIdentifier}>
        <BusinessCenterIcon /> Einkommen in € (brutto)
      </label>

      <input
        id={inputIdentifier}
        type="text"
        className={classNames(
          "appearance-none px-24 py-10",
          "border-2 border-solid border-Basis",
        )}
        aria-label={ariaLabel}
        value={bruttoeinkommen ?? ""}
        inputMode="numeric"
        pattern="[0-9]*"
        onKeyDown={filterNonNumbericInput}
        onChange={gebeBruttoeinkommenAn}
      />
    </div>
  );
}

const SPECIAL_INPUT_KEYS = [
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "Tab",
];
