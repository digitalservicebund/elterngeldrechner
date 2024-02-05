import { useMemo, VFC } from "react";
import { CustomCheckbox, FormFieldGroup } from "../../molecules";
import { RegisterOptions, useFormContext } from "react-hook-form";
import {
  StepErwerbstaetigkeitState,
  TypeOfErwerbstaetigkeit,
} from "../../../redux/stepErwerbstaetigkeitSlice";
import { ElternteilType } from "@egr/monatsplaner-app";
import { infoTexts } from "../../molecules/info-dialog/infoTexts";

interface Props {
  elternteil: ElternteilType;
}

export const typeOfErwerbstaetigkeitLabels: {
  [K in keyof TypeOfErwerbstaetigkeit]: string;
} = {
  isNichtSelbststaendig: "Einkünfte aus nichtselbständiger Arbeit",
  isSelbststaendig: "Gewinneinkünfte",
};

export const ErwerbstaetigkeitCheckboxGroup: VFC<Props> = ({ elternteil }) => {
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
};
