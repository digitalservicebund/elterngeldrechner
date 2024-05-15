import { FieldValues } from "react-hook-form";
import {
  CustomRadio,
  CustomRadioProps,
  RadioOption,
} from "@/components/molecules/custom-radio";
import { YesNo } from "@/globals/js/calculations/model";

export const yesNoLabels: { [K in YesNo]: string } = {
  [YesNo.YES]: "Ja",
  [YesNo.NO]: "Nein",
};

const booleanOptions: RadioOption<YesNo>[] = [
  { value: YesNo.YES, label: yesNoLabels.YES },
  { value: YesNo.NO, label: yesNoLabels.NO },
];

const YesNoRadio = <TFieldValues extends FieldValues>(
  props: Omit<CustomRadioProps<TFieldValues>, "options">,
) => {
  return <CustomRadio {...props} options={booleanOptions} />;
};

export default YesNoRadio;
