import { VFC } from "react";

type TargetType = "BEG" | "BEGAndEG+";

interface Props {
  targetType: TargetType;
}

const getTargetTypeName = (targetType: TargetType) => {
  if (targetType === "BEG") {
    return "Basiselterngeld";
  }
  if (targetType === "BEGAndEG+") {
    return "Basiselterngeld- und ElterngeldPlus";
  }
};

export const NotificationNoFurtherMonthAvailable: VFC<Props> = ({
  targetType,
}) => {
  return (
    <div>
      Ihre verfügbaren {getTargetTypeName(targetType)}-Monate sind aufgebraucht.
    </div>
  );
};
