import { FieldValues } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  CustomRadioGroupProps,
} from "@/components/molecules";
import { YesNo } from "@/redux/yes-no";

const booleanOptions: CustomRadioGroupOption<YesNo>[] = [
  { value: YesNo.YES, label: "Ja" },
  { value: YesNo.NO, label: "Nein" },
];

function YesNoRadio<TFieldValues extends FieldValues>(
  props: Readonly<Omit<CustomRadioGroupProps<TFieldValues>, "options">>,
) {
  return <CustomRadioGroup {...props} options={booleanOptions} />;
}

export default YesNoRadio;
