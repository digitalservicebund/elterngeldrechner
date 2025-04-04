import { FieldPath, FieldValues, UseFormRegister } from "react-hook-form";

type Props<TFieldValues extends FieldValues> = {
  readonly register: UseFormRegister<TFieldValues>;
  readonly name: FieldPath<TFieldValues>;
  readonly label: string;
};

export function CustomInput<TFieldValues extends FieldValues>({
  register,
  name,
  label,
}: Props<TFieldValues>) {
  return (
    <div className="flex flex-col gap-8">
      <label htmlFor={name}>{label}</label>

      <input
        className="max-w-[14.25rem] border border-solid border-grey-dark px-16 py-8 focus:!outline focus:!outline-2 focus:!outline-primary"
        {...register(name)}
        type="text"
        id={name}
      />
    </div>
  );
}
