import { type ReactNode, useId } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { InfoText } from "@/application/components";
import { CustomNumberField } from "@/application/features/abfrageteil/components/common";
import { Antragstellende } from "@/application/features/abfrageteil/state";

type Props<
  FormFields extends FieldValues,
  FieldName extends FieldPath<FormFields>,
> = {
  readonly formControl: Control<FormFields>;
  readonly formFieldName: FieldName;
  readonly elternteilName: string;
  readonly antragstellende: Antragstellende | null;
};

export function EingabeFuerGewinneinkuenfte<
  FormFields extends FieldValues,
  FieldName extends FieldPath<FormFields>,
>({
  formControl,
  formFieldName,
  elternteilName,
  antragstellende,
}: Props<FormFields, FieldName>): ReactNode {
  const descriptionIdentifier = useId();

  return (
    <div>
      <p id={descriptionIdentifier}>
        {antragstellende === "FuerBeide" ? (
          <>
            Wie hoch war der Gewinn von {elternteilName} im{" "}
            <b>letzten Kalenderjahr</b> vor der Geburt Ihres Kindes?
          </>
        ) : (
          <>
            Wie hoch war Ihr Gewinn im <b>letzten Kalenderjahr</b> vor der
            Geburt Ihres Kindes?
          </>
        )}
      </p>

      <InfoText
        className="mb-8"
        question="Wo finde ich diese Information?"
        answer="Dies ergibt sich in der Regel aus Ihrem letzten Einkommensteuerbescheid oder Sie können schätzen."
      />

      <CustomNumberField
        name={formFieldName}
        label="Gewinn im letzten Kalenderjahr in Brutto"
        suffix="Euro"
        control={formControl}
        ariaDescribedByIfNoError={descriptionIdentifier}
      />
    </div>
  );
}
