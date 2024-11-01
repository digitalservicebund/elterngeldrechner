import { useFormContext } from "react-hook-form";
import type { ElternteilType } from "@/globals/js/elternteil-type";
import { CustomNumberField, FormFieldGroup } from "@/components/molecules";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";
import { infoTexts } from "@/components/molecules/info-dialog";

interface NurSelbstaendigProps {
  readonly elternteil: ElternteilType;
}

export function NurSelbstaendig({ elternteil }: NurSelbstaendigProps) {
  const { setValue, control } = useFormContext<StepEinkommenState>();

  setValue(`${elternteil}.gewinnSelbstaendig.type`, "yearly");

  return (
    <FormFieldGroup headline="Gewinneinkünfte">
      <CustomNumberField
        control={control}
        name={`${elternteil}.gewinnSelbstaendig.perYear`}
        label="Wie hoch war Ihr Gewinn im Kalenderjahr vor der Geburt Ihres Kindes?"
        suffix="Euro"
        max={999999}
        required
        info={infoTexts.einkommenGewinneinkuenfte}
      />
    </FormFieldGroup>
  );
}
