import BusinessCenterIcon from "@digitalservicebund/icons/BusinessCenterOutlined";
import classNames from "classnames";
import {
  type CSSProperties,
  type ChangeEvent,
  type KeyboardEvent,
  ReactNode,
  useId,
} from "react";
import type { Einkommen } from "@/monatsplaner";

type Props = {
  readonly bruttoeinkommen: Einkommen | undefined;
  readonly isMissing: boolean;
  readonly vorschlaege: number[];
  readonly ariaLabel: string;
  readonly ariaDescribedBy?: string;
  readonly gebeEinkommenAn: (bruttoeinkommen: number) => void;
  readonly style?: CSSProperties;
};

export function BruttoeinkommenInput({
  bruttoeinkommen,
  isMissing,
  vorschlaege,
  ariaLabel,
  ariaDescribedBy,
  gebeEinkommenAn,
  style,
}: Props): ReactNode {
  const inputIdentifier = useId();

  function filterNonNumbericInput(event: KeyboardEvent<HTMLInputElement>) {
    const isNumber = event.key.match(/[0-9]/) != null;
    const isSpecialKey = SPECIAL_INPUT_KEYS.includes(event.key);
    const isModifierActive = event.ctrlKey || event.metaKey || event.altKey;
    const shouldFilter = !isNumber && !isSpecialKey && !isModifierActive;
    if (shouldFilter) event.preventDefault();
  }

  function gebeBruttoeinkommenAn(event: ChangeEvent<HTMLInputElement>) {
    const bruttoeinkommen = Number.parseInt(event.target.value);
    gebeEinkommenAn(bruttoeinkommen);
  }

  const datalistIdentifier = useId();

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
          "border-2 border-solid",
          isMissing ? "border-warning" : "border-Basis",
        )}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        value={bruttoeinkommen ?? ""}
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        list={datalistIdentifier}
        onKeyDown={filterNonNumbericInput}
        onChange={gebeBruttoeinkommenAn}
      />

      <datalist id={datalistIdentifier}>
        {vorschlaege.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </datalist>
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
