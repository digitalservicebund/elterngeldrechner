type CalculationErrorCode =
  | "MischEinkommenEnabledButMissingMischEinkommen"
  | "BmfSteuerRechnerCallFailed"
  | "BmfSteuerRechnerNotImplementedForLohnsteuerjahr";

export function errorOf(calculationErrorCode: CalculationErrorCode) {
  return new Error(calculationErrorCode);
}
