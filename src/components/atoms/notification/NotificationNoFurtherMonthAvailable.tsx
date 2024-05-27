type TargetType = "BEG" | "BEGAndEG+";

interface Props {
  readonly targetType: TargetType;
}

const getTargetTypeName = (targetType: TargetType) => {
  if (targetType === "BEG") {
    return "Basiselterngeld";
  }
  if (targetType === "BEGAndEG+") {
    return "Basiselterngeld- und ElterngeldPlus";
  }
};

export function NotificationNoFurtherMonthAvailable({ targetType }: Props) {
  return (
    <div>
      Ihre verfügbaren {getTargetTypeName(targetType)}-Monate sind aufgebraucht.
    </div>
  );
}
