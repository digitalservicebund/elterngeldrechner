import { useMemo } from "react";
import { RegisterOptions, useFormContext } from "react-hook-form";
import { CustomCheckbox, FormFieldGroup } from "@/components/molecules";
import {
  StepErwerbstaetigkeitState,
  TypeOfErwerbstaetigkeit,
} from "@/redux/stepErwerbstaetigkeitSlice";
import { ElternteilType } from "@/globals/js/elternteil-type";
import { infoTexts } from "@/components/molecules/info-dialog";

interface Props {
  readonly elternteil: ElternteilType;
}

const typeOfErwerbstaetigkeitLabels: {
  [K in keyof TypeOfErwerbstaetigkeit]: string;
} = {
  isNichtSelbststaendig: "Einkünfte aus nichtselbständiger Arbeit",
  isSelbststaendig: "Gewinneinkünfte",
};

export function ErwerbstaetigkeitCheckboxGroup({ elternteil }: Props) {
  const {
    register,
    getValues,
    formState: { errors },
  } = useFormContext<StepErwerbstaetigkeitState>();

  const hasSelbststaendigRegisterOptions = useMemo<
    RegisterOptions<StepErwerbstaetigkeitState>
  >(
    () => ({
      validate: {
        requireErwerbstaetigkeit: (isSelbststaendig) => {
          const isNichtSelbststaendig = getValues(
            `${elternteil}.isNichtSelbststaendig`,
          );
          const isValid = !!isSelbststaendig || isNichtSelbststaendig;
          return isValid || "Bitte wählern sie eine Erwerbstätigkeit aus.";
        },
      },
    }),
    [getValues, elternteil],
  );

  return (
    <FormFieldGroup description="Ich hatte in diesem Zeitraum…">
      <CustomCheckbox
        register={register}
        registerOptions={{
          deps: [`${elternteil}.isSelbststaendig`],
        }}
        name={`${elternteil}.isNichtSelbststaendig`}
        label={typeOfErwerbstaetigkeitLabels.isNichtSelbststaendig}
        errors={!!errors[elternteil]?.isSelbststaendig}
        info={infoTexts.erwerbstaetigkeitNichtSelbststaendig}
      />
      <CustomCheckbox
        register={register}
        registerOptions={hasSelbststaendigRegisterOptions}
        name={`${elternteil}.isSelbststaendig`}
        label={typeOfErwerbstaetigkeitLabels.isSelbststaendig}
        errors={errors}
        info={infoTexts.erwerbstaetigkeitGewinneinkuenfte}
      />
    </FormFieldGroup>
  );
}
