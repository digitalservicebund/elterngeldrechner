import { type ReactNode } from "react";
import { type FieldPath, useFormContext } from "react-hook-form";
import { Versicherungen } from "./Versicherungen";
import { EingabeFuerGewinneinkuenfte } from "@/components/organisms/einkommen-form/EingabeFuerGewinneinkuenfte";
import type { ElternteilType } from "@/redux/elternteil-type";
import type { StepEinkommenState } from "@/redux/stepEinkommenSlice";

type Props = {
  readonly elternteil: ElternteilType;
  readonly taetigkeitsIndex: number;
};

export function Selbststaendig({
  taetigkeitsIndex,
  elternteil,
}: Props): ReactNode {
  const baseFieldPath: FieldPath<StepEinkommenState> = `${elternteil}.taetigkeitenNichtSelbstaendigUndSelbstaendig.${taetigkeitsIndex}`;
  const { control } = useFormContext<StepEinkommenState>();

  return (
    <>
      <EingabeFuerGewinneinkuenfte
        formControl={control}
        formFieldName={`${baseFieldPath}.gewinneinkuenfte`}
      />

      <Versicherungen
        hasRentenversicherungName={`${baseFieldPath}.versicherungen.hasRentenversicherung`}
        hasKrankenversicherungName={`${baseFieldPath}.versicherungen.hasKrankenversicherung`}
        hasArbeitslosenversicherungName={`${baseFieldPath}.versicherungen.hasArbeitslosenversicherung`}
        noneName={`${baseFieldPath}.versicherungen.none`}
      />
    </>
  );
}
