import { FieldValues } from "react-hook-form";
import {
  CustomRadio,
  CustomRadioProps,
  CustomRadioOption,
} from "@/components/molecules";
import { YesNo } from "@/globals/js/calculations/model";

const yesNoLabels: { [K in YesNo]: string } = {
  [YesNo.YES]: "Ja",
  [YesNo.NO]: "Nein",
};

const booleanOptions: CustomRadioOption<YesNo>[] = [
  { value: YesNo.YES, label: yesNoLabels.YES },
  { value: YesNo.NO, label: yesNoLabels.NO },
];

function YesNoRadio<TFieldValues extends FieldValues>(
  props: Readonly<Omit<CustomRadioProps<TFieldValues>, "options">>,
) {
  return <CustomRadio {...props} options={booleanOptions} />;
}

export default YesNoRadio;
