import { useId } from "react";
import { type FieldError, get, useFormContext } from "react-hook-form";
import { CustomCheckbox } from "@/components/molecules";
import { infoTexts } from "@/components/molecules/info-dialog";
import { ElternteilType } from "@/redux/elternteil-type";
import { StepErwerbstaetigkeitState } from "@/redux/stepErwerbstaetigkeitSlice";

interface Props {
  readonly elternteil: ElternteilType;
}

export function ErwerbstaetigkeitCheckboxGroup({ elternteil }: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<StepErwerbstaetigkeitState>();

  const isSelbstaendigFieldName = `${elternteil}.isSelbststaendig` as const;
  const isNichtSelbstaendigFieldName =
    `${elternteil}.isNichtSelbststaendig` as const;

  function isAnyOptionSelected(): true | string {
    const anyOptionIsSelected = [
      isSelbstaendigFieldName,
      isNichtSelbstaendigFieldName,
    ].some((fieldName) => getValues(fieldName));

    return anyOptionIsSelected || "Bitte wählen sie eine Erwerbstätigkeit aus.";
  }

  const error = get(errors, isNichtSelbstaendigFieldName) as  // Strongly depends on which field has the validation.
    | FieldError
    | undefined;
  const hasError = error !== undefined;
  const errorIdentifier = useId();

  return (
    <fieldset
      className="mb-32"
      aria-describedby={hasError ? errorIdentifier : undefined}
    >
      <legend className="mb-16">Ich hatte in diesem Zeitraum…</legend>

      <CustomCheckbox
        register={register}
        registerOptions={{ validate: { isAnyOptionSelected } }}
        name={isNichtSelbstaendigFieldName}
        label="Einkünfte aus nichtselbständiger Arbeit"
        errors={hasError}
        info={infoTexts.erwerbstaetigkeitNichtSelbststaendig}
      />

      <CustomCheckbox
        register={register}
        registerOptions={{ deps: [isNichtSelbstaendigFieldName] }}
        name={isSelbstaendigFieldName}
        label="Gewinneinkünfte"
        errors={hasError}
        info={infoTexts.erwerbstaetigkeitGewinneinkuenfte}
      />

      {!!hasError && (
        <div className="mt-8 text-14 text-danger" id={errorIdentifier}>
          {error.message}
        </div>
      )}
    </fieldset>
  );
}
