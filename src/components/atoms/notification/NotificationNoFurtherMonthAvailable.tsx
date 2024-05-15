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

export const NotificationNoFurtherMonthAvailable = ({ targetType }: Props) => {
  return (
    <div>
      Ihre verfügbaren {getTargetTypeName(targetType)}-Monate sind aufgebraucht.
    </div>
  );
};
