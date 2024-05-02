type CalculationErrorCode =
  | "MischEinkommenEnabledButMissingMischEinkommen"
  | "ZeitraumVonBisIllegalArgument"
  | "BmfSteuerRechnerCallFailed"
  | "BmfSteuerRechnerDomainUndefined"
  | "BmfSteuerRechnerCodeUndefined"
  | "BmfSteuerRechnerNotImplementedForLohnsteuerjahr"
  | "BmfSteuerRechnerAvailableYearsUndefined";

export function errorOf(calculationErrorCode: CalculationErrorCode) {
  return new Error(calculationErrorCode);
}
