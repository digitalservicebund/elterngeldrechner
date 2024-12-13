type CalculationErrorCode =
  | "MischEinkommenEnabledButMissingMischEinkommen"
  | "NichtUnterstuetztesLohnsteuerjahr";

export function errorOf(calculationErrorCode: CalculationErrorCode) {
  return new Error(calculationErrorCode);
}
