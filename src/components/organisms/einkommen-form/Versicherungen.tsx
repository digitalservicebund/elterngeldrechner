import { ChangeEvent, useId, useMemo } from "react";
import {
  FieldError,
  Path,
  get,
  useFormContext,
  RegisterOptions,
} from "react-hook-form";
import {
  StepEinkommenState,
  TypeOfVersicherungen,
} from "@/redux/stepEinkommenSlice";
import { CustomCheckbox } from "@/components/molecules";

type VersicherungenProps = Readonly<{
  [Property in keyof TypeOfVersicherungen as `${Property}Name`]: Path<StepEinkommenState>;
}>;

const typeOfVersicherungenLabels: {
  [K in keyof TypeOfVersicherungen]: string;
} = {
  hasRentenversicherung: "rentenversicherungspflichtig",
  hasKrankenversicherung: "krankenversicherungspflichtig",
  hasArbeitslosenversicherung: "arbeitslosenversicherungspflichtig",
  none: "keines der Genannten",
};

export function Versicherungen({
  hasRentenversicherungName,
  hasArbeitslosenversicherungName,
  hasKrankenversicherungName,
  noneName,
}: VersicherungenProps) {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<StepEinkommenState>();

  const error = get(errors, noneName) as FieldError | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  const handleChangeNoneVersicherung = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!event.target.checked) return;

    setValue(hasRentenversicherungName, false);
    setValue(hasKrankenversicherungName, false);
    setValue(hasArbeitslosenversicherungName, false);
  };

  const versicherungenRegisterOptions: RegisterOptions<StepEinkommenState> =
    useMemo(
      () => ({
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          if (!event.target.checked) return;
          setValue(noneName, false);
        },
        deps: [noneName],
      }),
      [noneName, setValue],
    );

  return (
    <fieldset
      className="mb-32"
      aria-describedby={hasError ? errorIdentifier : undefined}
    >
      <legend className="mb-16">
        Ich war während der Ausübung dieser Tätigkeit
      </legend>

      <CustomCheckbox
        register={register}
        registerOptions={versicherungenRegisterOptions}
        name={hasRentenversicherungName}
        label={typeOfVersicherungenLabels.hasRentenversicherung}
      />
      <CustomCheckbox
        register={register}
        registerOptions={versicherungenRegisterOptions}
        name={hasKrankenversicherungName}
        label={typeOfVersicherungenLabels.hasKrankenversicherung}
      />
      <CustomCheckbox
        register={register}
        registerOptions={versicherungenRegisterOptions}
        name={hasArbeitslosenversicherungName}
        label={typeOfVersicherungenLabels.hasArbeitslosenversicherung}
      />
      <CustomCheckbox
        register={register}
        name={noneName}
        label={typeOfVersicherungenLabels.none}
        registerOptions={{
          validate: {
            validVersicherungOrNone: (value) => {
              if (value === true) {
                return true;
              }
              const hasOtherSelection = [
                hasRentenversicherungName,
                hasKrankenversicherungName,
                hasArbeitslosenversicherungName,
              ].some((fieldName) => getValues(fieldName) === true);

              return (
                hasOtherSelection ||
                "Mindestens eine Option muss gewählt werden"
              );
            },
          },
          onChange: handleChangeNoneVersicherung,
        }}
      />

      {!!hasError && <span id={errorIdentifier}>{error.message}</span>}
    </fieldset>
  );
}
