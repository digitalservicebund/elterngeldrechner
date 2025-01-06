import { FieldValues } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  CustomRadioGroupProps,
} from "@/components/molecules";
import { YesNo } from "@/redux/yes-no";

const yesNoLabels: { [K in YesNo]: string } = {
  [YesNo.YES]: "Ja",
  [YesNo.NO]: "Nein",
};

const booleanOptions: CustomRadioGroupOption<YesNo>[] = [
  { value: YesNo.YES, label: yesNoLabels.YES },
  { value: YesNo.NO, label: yesNoLabels.NO },
];

function YesNoRadio<TFieldValues extends FieldValues>(
  props: Readonly<Omit<CustomRadioGroupProps<TFieldValues>, "options">>,
) {
  return <CustomRadioGroup {...props} options={booleanOptions} />;
}

export default YesNoRadio;
