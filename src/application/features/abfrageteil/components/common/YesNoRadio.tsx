import type { ReactNode } from "react";
import { FieldValues } from "react-hook-form";
import {
  CustomRadioGroup,
  CustomRadioGroupOption,
} from "@/application/components/CustomRadioGroup";
import { YesNo } from "@/application/features/abfrageteil/state";

const booleanOptions: CustomRadioGroupOption<YesNo>[] = [
  { value: YesNo.YES, label: "Ja" },
  { value: YesNo.NO, label: "Nein" },
];

type Props<TFieldValues extends FieldValues> = Omit<
  Parameters<typeof CustomRadioGroup<TFieldValues>>[0],
  "options"
>;

export function YesNoRadio<TFieldValues extends FieldValues>(
  props: Props<TFieldValues>,
): ReactNode {
  return <CustomRadioGroup {...props} options={booleanOptions} />;
}
