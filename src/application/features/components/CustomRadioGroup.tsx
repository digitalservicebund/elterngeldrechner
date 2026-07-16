import classNames from "classnames";
import { ReactNode, useId } from "react";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  get,
} from "react-hook-form";

type RadioGroupValue = string | number;

export interface CustomRadioGroupOption<
  V extends RadioGroupValue = RadioGroupValue,
> {
  value: V;
  label: string;
  description?: (id: string) => ReactNode;
}

type Props<TFieldValues extends FieldValues> = {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly legend: string | ReactNode;
  readonly options: CustomRadioGroupOption[];
  readonly errors?: FieldErrors<TFieldValues>;
  readonly required?: boolean;
  readonly horizontal?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly children?: ReactNode;
};

export function CustomRadioGroup<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  legend,
  options,
  errors,
  required,
  horizontal = false,
  disabled = false,
  className,
  children,
}: Props<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const baseId = useId();

  const vertical = !horizontal;

  return (
    <div className="relative">
      <fieldset
        role="radiogroup"
        className={classNames(
          "flex gap-kern-default",
          {
            "flex-col": vertical,
            "justify-around": horizontal,
          },
          className,
        )}
        aria-describedby={hasError ? errorIdentifier : undefined}
      >
        <legend className="title-large mb-kern-default">{legend}</legend>

        {!!children && <div>{children}</div>}

        {options.map((option, i) => {
          const descriptionId = `${baseId}-${option.value}`;

          return (
            <label
              key={option.value}
              className={getLabelClassName(hasError, horizontal, disabled)}
            >
              <input
                {...register(name, registerOptions)}
                aria-describedby={descriptionId}
                className={getInputClassName(hasError, disabled)}
                type="radio"
                data-testid={name + "_option_" + i}
                value={option.value}
                required={required}
                disabled={disabled}
              />
              {vertical && option.description ? (
                <span className="flex flex-col gap-y-4">
                  <span className="font-bold">{option.label}</span>
                  {option.description(descriptionId)}
                </span>
              ) : (
                <>
                  {option.label}
                  {!!option.description && option.description(descriptionId)}
                </>
              )}
            </label>
          );
        })}

        {!!hasError && (
          <span id={errorIdentifier} className="text-14 text-danger">
            {error.message}
          </span>
        )}
      </fieldset>
    </div>
  );
}

function getInputClassName(hasError: boolean, disabled: boolean): string {
  return classNames(
    "relative size-32 min-w-32 rounded-full border border-solid border-primary bg-white",
    "before:size-16 before:rounded-full before:content-['']",
    "before:absolute before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2",
    "checked:before:bg-primary",
    { "hover:border-2 hover:border-primary": !disabled },
    { "focus:border-2 focus:border-primary": !disabled },
    { "!border-danger !checked:before:bg-danger": hasError },
    { "cursor-default": disabled },
  );
}

function getLabelClassName(
  hasError: boolean,
  horizontal: boolean,
  disabled: boolean,
) {
  return classNames("flex content-center gap-x-16 gap-y-8", {
    "text-danger": hasError,
    "items-center": horizontal,
    "flex-col": horizontal,
    "cursor-default": disabled,
  });
}

if (import.meta.vitest) {
  const { describe, expect, it } = import.meta.vitest;

  describe("Custom Radio Group", async () => {
    const { render, screen } = await import("@testing-library/react");
    const { useForm } = await import("react-hook-form");

    // Options are distinguished by their value, not their label: two options
    // may share a label but must still get distinct description ids so their
    // descriptions are addressed individually.
    it("gives each option a unique description id even with identical labels", () => {
      function TestComponent() {
        const { register } = useForm<{ art: string }>();

        return (
          <CustomRadioGroup
            register={register}
            name="art"
            legend="Art der weiteren Tätigkeit?"
            options={[
              {
                value: "no",
                label: "Weitere Tätigkeit",
                description: (id) => <span id={id}>angestellt</span>,
              },
              {
                value: "yes",
                label: "Weitere Tätigkeit",
                description: (id) => <span id={id}>selbstständig</span>,
              },
            ]}
          />
        );
      }

      render(<TestComponent />);

      const beschreibungsIds = screen
        .getAllByRole("radio")
        .map((radio) => radio.getAttribute("aria-describedby"));

      expect(new Set(beschreibungsIds).size).toBe(beschreibungsIds.length);
    });
  });
}
