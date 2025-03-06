import { useId } from "react";
import { useFormContext } from "react-hook-form";
import { EingabeFuerGewinneinkuenfte } from "./EingabeFuerGewinneinkuenfte";
import type { ElternteilType } from "@/application/redux/elternteil-type";
import { StepEinkommenState } from "@/application/redux/stepEinkommenSlice";

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

      <EingabeFuerGewinneinkuenfte
        formControl={control}
        formFieldName={`${elternteil}.gewinnSelbstaendig.perYear`}
      />
    </section>
  );
}
