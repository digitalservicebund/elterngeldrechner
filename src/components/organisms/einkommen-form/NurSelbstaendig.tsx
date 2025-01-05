import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { CustomNumberField } from "@/components/molecules";
import { infoTexts } from "@/components/molecules/info-dialog";
import type { ElternteilType } from "@/redux/elternteil-type";
import { StepEinkommenState } from "@/redux/stepEinkommenSlice";

interface NurSelbstaendigProps {
  readonly elternteil: ElternteilType;
}

export function NurSelbstaendig({ elternteil }: NurSelbstaendigProps) {
  const { setValue, control } = useFormContext<StepEinkommenState>();

  setValue(`${elternteil}.gewinnSelbstaendig.type`, "yearly");

  const headingIdentifier = useId();

  return (
    <section aria-labelledby={headingIdentifier}>
      <h3 id={headingIdentifier} className="mb-10">
        Gewinneinkünfte
      </h3>

      <CustomNumberField
        control={control}
        name={`${elternteil}.gewinnSelbstaendig.perYear`}
        label="Wie hoch war Ihr Gewinn im Kalenderjahr vor der Geburt Ihres Kindes?"
        suffix="Euro"
        max={999999}
        required
        info={infoTexts.einkommenGewinneinkuenfte}
      />
    </section>
  );
}
