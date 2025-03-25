import { ChangeEvent, useId } from "react";
import { FieldError, Path, get, useFormContext } from "react-hook-form";
import {
  CustomCheckbox,
  Description,
} from "@/application/features/abfrageteil/components/common";
import {
  type StepEinkommenState,
  type TypeOfVersicherungen,
} from "@/application/features/abfrageteil/state";

type VersicherungenProps = Readonly<{
  [Property in keyof TypeOfVersicherungen as `${Property}Name`]: Path<StepEinkommenState>;
}>;

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

  function unselectAllVersicherungenOptionsIfSelectingNoneOption(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (event.target.checked) {
      setValue(hasRentenversicherungName, false);
      setValue(hasKrankenversicherungName, false);
      setValue(hasArbeitslosenversicherungName, false);
    }
  }

  function unselectNoneOptionIfSelectingAnyVersicherungOption(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    if (event.target.checked) {
      setValue(noneName, false);
    }
  }

  function isAnyVersicherungsOptionSelectedOrNoneOption(): true | string {
    const isNoneOptionSelected = getValues(noneName);
    const isAnyVersicherungsOptionSelected = [
      hasRentenversicherungName,
      hasKrankenversicherungName,
      hasArbeitslosenversicherungName,
    ].some((fieldName) => getValues(fieldName));

    const isSelectionValid =
      isNoneOptionSelected !== isAnyVersicherungsOptionSelected; // XOR

    return isSelectionValid || "Mindestens eine Option muss gewählt werden";
  }

  const error = get(errors, hasRentenversicherungName) as
    | FieldError
    | undefined; // Depends on which fields has the validation.
  const hasError = error !== undefined;
  const errorIdentifier = useId();

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
        registerOptions={{
          onChange: unselectNoneOptionIfSelectingAnyVersicherungOption,
          validate: { isAnyVersicherungsOptionSelectedOrNoneOption },
          deps: [
            hasKrankenversicherungName,
            hasArbeitslosenversicherungName,
            noneName,
          ],
        }}
        name={hasRentenversicherungName}
        label="rentenversicherungspflichtig"
        errors={hasError}
      />

      <CustomCheckbox
        register={register}
        registerOptions={{
          onChange: unselectNoneOptionIfSelectingAnyVersicherungOption,
          deps: [hasRentenversicherungName],
        }}
        name={hasKrankenversicherungName}
        label="krankenversicherungspflichtig"
        errors={hasError}
      />

      <CustomCheckbox
        register={register}
        registerOptions={{
          onChange: unselectNoneOptionIfSelectingAnyVersicherungOption,
          deps: [hasRentenversicherungName],
        }}
        name={hasArbeitslosenversicherungName}
        label="arbeitslosenversicherungspflichtig"
        errors={hasError}
      />

      <CustomCheckbox
        register={register}
        name={noneName}
        label="keines der Genannten"
        registerOptions={{
          onChange: unselectAllVersicherungenOptionsIfSelectingNoneOption,
          deps: [hasRentenversicherungName],
        }}
        errors={hasError}
      />

      {!!hasError && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </fieldset>
  );
}
