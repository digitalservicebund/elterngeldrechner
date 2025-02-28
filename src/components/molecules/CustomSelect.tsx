import classNames from "classnames";
import {
  FieldError,
  FieldErrors,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  get,
} from "react-hook-form";
import { Description } from "@/components/atoms";
import { type Info, InfoDialog } from "@/components/molecules";

export interface SelectOption<TValue extends string = string> {
  value: TValue;
  label: string;
  hidden?: boolean;
}

export const cloneOptionsList = (options: SelectOption[]) =>
  options.map((o) => {
    return { label: o.label, value: o.value, hidden: o.hidden };
  });

interface CustomSelectProps<TFieldValues extends FieldValues> {
  readonly register: UseFormRegister<TFieldValues>;
  readonly registerOptions?: RegisterOptions<TFieldValues>;
  readonly name: Path<TFieldValues>;
  readonly label: string;
  readonly errors?: FieldErrors<TFieldValues>;
  readonly options: SelectOption[];
  readonly autoWidth?: boolean;
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly info?: Info;
  readonly className?: string;
}

export function CustomSelect<TFieldValues extends FieldValues>({
  register,
  registerOptions,
  name,
  label,
  errors,
  options,
  autoWidth,
  required,
  disabled,
  info,
  className,
  ...aria
}: CustomSelectProps<TFieldValues>) {
  const error = get(errors, name) as FieldError | undefined;

  const customArrows = {
    backgroundImage: `url("data:image/svg+xml;utf8,<svg fill='black' height='22' viewBox='0 0 24 24' width='22' xmlns='http://www.w3.org/2000/svg'><path d='M12 2.29289L18.3536 8.64645L17.6464 9.35355L12 3.70711L6.35355 9.35355L5.64645 8.64645L12 2.29289Z'/><path d='M12 21.7071L5.64645 15.3536L6.35355 14.6464L12 20.2929L17.6464 14.6464L18.3536 15.3536L12 21.7071Z'/></svg>")`,
    backgroundRepeat: "no-repeat",
    backgroundPositionX: "calc(100% - 0.6875rem)",
    backgroundPositionY: "0.6875rem",
  };

  return (
    <div
      className={classNames(
        "flex w-full justify-between",
        autoWidth && "w-auto",
        className,
      )}
    >
      <div className="flex flex-col items-start">
        <label htmlFor={name}>{label}</label>

        <div className="relative w-full min-w-max">
          <select
            {...register(name, registerOptions)}
            className={classNames(
              "mt-16 min-w-max appearance-none border border-solid border-grey-dark bg-white !px-16 py-8 !pr-56",
              "focus:!outline focus:!outline-2 focus:!outline-primary disabled:cursor-default",
              error && "border-danger",
            )}
            style={customArrows}
            id={name}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? `${name}-error` : undefined}
            required={required}
            {...aria}
          >
            <option
              className="bg-white px-16 py-8"
              value=""
              disabled={required}
              hidden={required}
            >
              Bitte wählen
            </option>

            {options.map((option) => (
              <option
                key={option.value}
                className="bg-white px-16 py-8"
                value={option.value}
                hidden={option.hidden}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {!!error && (
          <Description id={`${name}-error`} error>
            {error.message}
          </Description>
        )}
      </div>

      {!!info && <InfoDialog info={info} />}
    </div>
  );
}
