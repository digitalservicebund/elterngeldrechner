import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { EingabeFuerGewinneinkuenfte } from "./EingabeFuerGewinneinkuenfte";
import {
  Antragstellende,
  type ElternteilType,
  type StepEinkommenState,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragstellende: Antragstellende | null;
};

export function NurSelbstaendig({
  elternteil,
  elternteilName,
  antragstellende,
}: Props) {
  const { setValue, control } = useFormContext<StepEinkommenState>();

  setValue(`${elternteil}.gewinnSelbstaendig.type`, "yearly");

  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="mb-10">
        Gewinneinkünfte
      </h3>

      <EingabeFuerGewinneinkuenfte
        formControl={control}
        elternteilName={elternteilName}
        antragstellende={antragstellende}
        formFieldName={`${elternteil}.gewinnSelbstaendig.perYear`}
      />
    </section>
  );
}
