import { type FieldPath, FieldValues } from "react-hook-form";
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

export function YesNoRadio<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>(
  props: Readonly<Omit<CustomRadioGroupProps<TFieldValues, TName>, "options">>,
) {
  return <CustomRadioGroup {...props} options={booleanOptions} />;
}
