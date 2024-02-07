import { ErrorCode } from "./error-code";

export interface ValidValidationResult {
  readonly isValid: true;
}

export interface InvalidValidationResult {
  readonly isValid: false;
  readonly errorCodes: readonly ErrorCode[];
}

export type ValidationResult = ValidValidationResult | InvalidValidationResult;

const validResult: ValidationResult = {
  isValid: true,
};

export const allOf = (
  ...validationResults: ValidationResult[]
): ValidationResult => {
  return validationResults.reduce((previousResult, current) => {
    if (current.isValid) {
      return previousResult;
    }
    const previousErrorCodes = previousResult.isValid
      ? []
      : previousResult.errorCodes;

    return {
      isValid: false,
      errorCodes: [...previousErrorCodes, ...current.errorCodes],
    };
  }, validResult);
};
/* eslint-disable no-redeclare */
/*
 * Function Overload:
 * https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
 */
export function validationRule<T>(
  errorCode: ErrorCode,
  predicate: (target: T) => boolean,
): (target: T) => ValidationResult;
export function validationRule<T, A>(
  errorCode: ErrorCode,
  predicate: (target: T, arg: A) => boolean,
): (target: T, arg: A) => ValidationResult;
export function validationRule<T>(
  errorCode: ErrorCode,
  predicate: (target: T, arg?: unknown) => boolean,
): (target: T, arg: unknown) => ValidationResult {
  return (target, arg) => {
    if (predicate(target, arg)) {
      return validResult;
    } else {
      return {
        isValid: false,
        errorCodes: [errorCode],
      };
    }
  };
}
/* eslint-enable no-redeclare */
