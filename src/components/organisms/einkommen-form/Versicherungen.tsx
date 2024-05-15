import { ChangeEvent, useMemo, VFC } from "react";
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
import { CustomCheckbox, FormFieldGroup } from "@/components/molecules";

type VersicherungenProps = {
  [Property in keyof TypeOfVersicherungen as `${Property}Name`]: Path<StepEinkommenState>;
};

const typeOfVersicherungenLabels: {
  [K in keyof TypeOfVersicherungen]: string;
} = {
  hasRentenversicherung: "rentenversicherungspflichtig",
  hasKrankenversicherung: "krankenversicherungspflichtig",
  hasArbeitslosenversicherung: "arbeitslosenversicherungspflichtig",
  none: "keines der Genannten",
};

export const Versicherungen: VFC<VersicherungenProps> = ({
  hasRentenversicherungName,
  hasArbeitslosenversicherungName,
  hasKrankenversicherungName,
  noneName,
}) => {
  const {
    register,
    formState: { errors },
    setValue,
    getValues,
  } = useFormContext<StepEinkommenState>();

  const versicherungenError: FieldError | undefined = get(errors, noneName);

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
    <FormFieldGroup
      description="Ich war während der Ausübung dieser Tätigkeit"
      aria-describedby={
        versicherungenError && "versicherungen-checkbox-group-error"
      }
    >
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
      {versicherungenError && (
        <span id="versicherungen-checkbox-group-error">
          {versicherungenError.message}
        </span>
      )}
    </FormFieldGroup>
  );
};
