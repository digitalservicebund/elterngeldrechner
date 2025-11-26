import classNames from "classnames";
import {
  type ForwardedRef,
  type InputHTMLAttributes,
  type LegacyRef,
  type MutableRefObject,
  forwardRef,
  useId,
} from "react";
import { IMask, useIMask } from "react-imask";
import { Description } from "@/application/features/abfrageteil/components/common";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "aria-invalid" | "placeholder" // Can't be customized as special usage in component.
> & {
  readonly error?: string;
};

export const CustomDate = forwardRef(function CustomDate(
  {
    className,
    "aria-describedby": ariaDescribedBy,
    error,
    ...htmlInputAttributes
  }: Props,
  ref?: ForwardedRef<HTMLInputElement>,
) {
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const dateFormatHintIdentifier = useId();

  const descriptionIdentifiers = [
    ariaDescribedBy,
    dateFormatHintIdentifier,
    hasError ? errorIdentifier : undefined,
  ]
    .filter((identifier) => !!identifier)
    .join(" ");

  const { ref: imaskRef } = useIMask({
    mask: Date,
    lazy: true,
    autofix: "pad",
    blocks: {
      d: {
        mask: IMask.MaskedRange,
        placeholderChar: "_",
        from: 1,
        to: 31,
        maxLength: 2,
      },
      m: {
        mask: IMask.MaskedRange,
        placeholderChar: "_",
        from: 1,
        to: 12,
        maxLength: 2,
      },
      Y: {
        mask: IMask.MaskedRange,
        placeholderChar: "_",
        from: 1900,
        to: 2999,
        maxLength: 4,
      },
    },
  });

  return (
    <div className={classNames("flex flex-col", className)}>
      <div
        className={classNames(
          "flex max-w-[20rem] flex-col border border-solid border-grey-dark px-16 py-8",
          "focus-within:outline focus-within:outline-2 focus-within:outline-primary",
          hasError && "mb-0 border-danger",
        )}
      >
        {/* <span
          id={dateFormatHintIdentifier}
          className="text-14 text-text-light"
          aria-label="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
        >
          TT.MM.JJJJ
        </span> */}

        <input
          {...htmlInputAttributes}
          ref={mergeRefs(ref, imaskRef)}
          className="border-none focus:outline-none"
          placeholder="__.__.___"
          aria-invalid={hasError}
          aria-describedby={descriptionIdentifiers}
        />
      </div>
      {/* <span
        id={dateFormatHintIdentifier}
        className="text-14 text-text-light mb-16"
        aria-label="Eingabeformat Tag Monat Jahr zum Beispiel 12.05.2022"
      >
        im Format TT.MM.JJJJ
      </span> */}

      {!!hasError && (
        <Description id={errorIdentifier} error>
          {error}
        </Description>
      )}
    </div>
  );
});

function mergeRefs<Value>(...refs: ReactReference<Value>[]) {
  return (value: Value) => {
    refs.forEach((ref) => {
      switch (typeof ref) {
        case "function":
          ref(value);
          break;

        case "object":
          if (ref) (ref as MutableRefObject<Value>).current = value;
          break;
      }
    });
  };
}

type ReactReference<Value> =
  | MutableRefObject<Value>
  | LegacyRef<Value>
  | undefined
  | null;
