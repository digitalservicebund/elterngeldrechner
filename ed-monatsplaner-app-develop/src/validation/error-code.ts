export type ErrorCode =
  | "HasNoSelection"
  | "HasTakenMoreThanTheAvailableBEGMonths"
  | "DoesNotHaveTheMinimumAmountOfEGMonthsOrNoneAtAll"
  | "DoesNotHaveContinuousEGAfterBEGAnspruch"
  | "HasTakenBEGAfterBEGAnspruch";
