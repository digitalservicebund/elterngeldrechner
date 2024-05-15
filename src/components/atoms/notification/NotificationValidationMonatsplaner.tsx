import { ErrorCode } from "@/monatsplaner";

interface Props {
  errorCodes: readonly ErrorCode[];
}

export const NotificationValidationMonatsplaner = ({ errorCodes }: Props) => {
  const messages = errorCodes.map((code) => {
    switch (code) {
      case "HasNoSelection":
        return "Mindestens ein Elternteil muss Elterngeld beantragen."; // already excluded with Frontend implementation
      case "HasTakenMoreThanTheAvailableBEGMonths":
        return "Reduzieren Sie auf die verfügbare Anzahl von Basiselterngeld-Monaten."; // already excluded with Frontend implementation
      case "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll":
        return "Nur 1 Monat Elterngeld für ein Elternteil ist nicht zulässig.";
      case "DoesNotHaveContinuousEGAfterBEGAnspruch":
        return "Elterngeld muss ab dem 15. Monat durchgängig genommen werden.";
      case "HasTakenBEGAfterBEGAnspruch":
        return "Basiselterngeld kann nicht nach dem 15. Monat genommen werden"; // already excluded with Frontend implementation
      default:
        return "";
    }
  });

  return (
    <>
      {messages.map((message) => (
        <div key={message}>{message}</div>
      ))}
    </>
  );
};
