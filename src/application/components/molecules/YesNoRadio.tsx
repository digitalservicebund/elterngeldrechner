import { FieldValues } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
  CustomRadioGroupProps,
} from "./CustomRadioGroup";
import { YesNo } from "@/application/redux/yes-no";

const booleanOptions: CustomRadioGroupOption<YesNo>[] = [
  { value: YesNo.YES, label: "Ja" },
  { value: YesNo.NO, label: "Nein" },
];

export function YesNoRadio<TFieldValues extends FieldValues>(
  props: Readonly<Omit<CustomRadioGroupProps<TFieldValues>, "options">>,
) {
  return <CustomRadioGroup {...props} options={booleanOptions} />;
}
