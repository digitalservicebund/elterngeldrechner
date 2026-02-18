import classNames from "classnames";
import { RegisterOptions } from "react-hook-form";
import { Description } from "@/application/features/abfrageteil/components/common";

type Props = {
  readonly label: string;
  readonly errors?: string;
  readonly registerOptions?: RegisterOptions;
  readonly required?: boolean;
  readonly name: string;
  readonly onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  readonly onBlur: (event: React.FocusEvent<HTMLInputElement>) => void;
  readonly ref: React.Ref<HTMLInputElement>;
};

export function NumberInput({
  label,
  errors,
  name,
  onChange,
  onBlur,
  ref,
}: Props) {
  return (
    <div
      className={classNames("egr-input-group", errors && "egr-input--error")}
    >
      <label
        className={classNames(
          "mb-4 block text-16",
          errors ? "text-danger" : null,
        )}
        htmlFor={name}
      >
        {label}
      </label>

      <input
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        className={classNames(
          "box-border w-full max-w-[150px] border border-solid px-16 py-8 focus:outline focus:outline-2 focus:!outline-primary",
          errors ? "border-danger" : "border-grey-dark",
        )}
        type="string"
        id={name}
        aria-describedby={errors ? `${name}-error` : undefined}
        aria-invalid={!!errors}
      />

      {!!errors && (
        <Description id={`${name}-error`} error>
          {errors}
        </Description>
      )}
    </div>
  );
}
