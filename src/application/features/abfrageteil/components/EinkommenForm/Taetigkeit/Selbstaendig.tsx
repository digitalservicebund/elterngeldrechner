import { type ReactNode } from "react";
import { type FieldPath, useFormContext } from "react-hook-form";
import { Versicherungen } from "./Versicherungen";
import { EingabeFuerGewinneinkuenfte } from "@/application/features/abfrageteil/components/EinkommenForm/EingabeFuerGewinneinkuenfte";
import {
  Antragstellende,
  type ElternteilType,
  type StepEinkommenState,
} from "@/application/features/abfrageteil/state";

type Props = {
  readonly elternteil: ElternteilType;
  readonly elternteilName: string;
  readonly antragstellende: Antragstellende | null;
  readonly taetigkeitsIndex: number;
};

export function Selbststaendig({
  taetigkeitsIndex,
  elternteil,
  elternteilName,
  antragstellende,
}: Props): ReactNode {
  const baseFieldPath: FieldPath<StepEinkommenState> = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig.${taetigkeitsIndex}`;
  const { control } = useFormContext<StepEinkommenState>();

  return (
    <>
      <EingabeFuerGewinneinkuenfte
        elternteilName={elternteilName}
        antragstellende={antragstellende}
        formControl={control}
        formFieldName={`${baseFieldPath}.gewinneinkuenfte`}
      />

      <Versicherungen
        elternteilName={elternteilName}
        antragstellende={antragstellende}
        hasRentenversicherungName={`${baseFieldPath}.versicherungen.hasRentenversicherung`}
        hasKrankenversicherungName={`${baseFieldPath}.versicherungen.hasKrankenversicherung`}
        hasArbeitslosenversicherungName={`${baseFieldPath}.versicherungen.hasArbeitslosenversicherung`}
        noneName={`${baseFieldPath}.versicherungen.none`}
      />
    </>
  );
}
