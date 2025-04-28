import { useId } from "react";
import { type FieldError, get, useFormContext } from "react-hook-form";
import { InfoText } from "@/application/components";
import {
  CustomCheckbox,
  Description,
} from "@/application/features/abfrageteil/components/common";
import {
  Antragstellende,
  type ElternteilType,
  type StepErwerbstaetigkeitState,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragssteller: Antragstellende | null;
};

export function ErwerbstaetigkeitCheckboxGroup({
  elternteil,
  elternteilName,
  antragssteller,
}: Props) {
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
    <fieldset aria-describedby={hasError ? errorIdentifier : undefined}>
      <legend className="mb-8">
        {antragssteller === "FuerBeide" ? (
          <>{elternteilName} hatte in diesem Zeitraum…</>
        ) : (
          <>Ich hatte in diesem Zeitraum…</>
        )}
      </legend>

      <CustomCheckbox
        register={register}
        registerOptions={{ validate: { isAnyOptionSelected } }}
        name={isNichtSelbstaendigFieldName}
        label="Einkünfte aus nichtselbständiger Arbeit"
        errors={hasError}
      />

      <InfoText
        question="Was bedeutet das?"
        answer="Zum Beispiel Lohn, Gehalt (auch aus einem Minijob)"
      />

      <CustomCheckbox
        register={register}
        registerOptions={{ deps: [isNichtSelbstaendigFieldName] }}
        name={isSelbstaendigFieldName}
        label="Gewinneinkünfte"
        errors={hasError}
        className="pt-32"
      />

      <InfoText
        question="Was bedeutet das?"
        answer="Einkünfte aus einem Gewerbebetrieb (auch zum Beispiel aus dem Betrieb einer Fotovoltaik-Anlage), Einkünfte aus selbständiger Arbeit (auch zum Beispiel aus einem Nebenberuf), Einkünfte aus Land- und Forstwirtschaft"
      />

      {!!hasError && (
        <Description id={errorIdentifier} error>
          {error.message}
        </Description>
      )}
    </fieldset>
  );
}
