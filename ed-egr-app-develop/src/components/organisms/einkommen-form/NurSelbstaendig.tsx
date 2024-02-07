import { VFC } from "react";
import type { ElternteilType } from "../../../monatsplaner";
import { useFormContext } from "react-hook-form";
import {
  CustomNumberField,
  FormFieldGroup,
  SelectOption,
} from "../../molecules";
import { StepEinkommenState } from "../../../redux/stepEinkommenSlice";
import { infoTexts } from "../../molecules/info-dialog";

interface NurSelbstaendigProps {
  elternteil: ElternteilType;
  monthsBeforeBirth: SelectOption[];
}

export const NurSelbstaendig: VFC<NurSelbstaendigProps> = ({ elternteil }) => {
  const { setValue, control } = useFormContext<StepEinkommenState>();

  setValue(`${elternteil}.gewinnSelbstaendig.type`, "yearly");

  return (
    <>
      <FormFieldGroup headline="Gewinneinkünfte">
        <CustomNumberField
          control={control}
          name={`${elternteil}.gewinnSelbstaendig.perYear`}
          label="Wie hoch war Ihr Gewinn im Kalenderjahr vor der Geburt Ihres Kindes?"
          suffix="Euro"
          max={999999}
          required={true}
          info={infoTexts.einkommenGewinneinkuenfte}
        />
      </FormFieldGroup>
    </>
  );
};
