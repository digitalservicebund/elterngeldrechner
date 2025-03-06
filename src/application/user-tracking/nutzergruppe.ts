import { setTrackingVariable } from "./data-layer";

enum Nutzergruppe {
  WERDENDE_ELTERN = "werdende Eltern",
  JUNGE_ELTERN = "junge Eltern",
  NACHBEANTRAGENDE_ELTERN = "nachbeantragende Eltern",
}

export function trackNutzergruppe(birthdate: Date): void {
  const nutzergruppe = mapDateToNutzergruppe(birthdate);
  setTrackingVariable(TRACKING_VARIABLE_NAME, nutzergruppe);
}

function mapDateToNutzergruppe(birthdate: Date): Nutzergruppe {
  const today = new Date();
  const dayThreeMonthsAgo = new Date(new Date().setMonth(today.getMonth() - 3));

  const isInFuture = birthdate > today;
  const wasWithinLastThreeMonths =
    dayThreeMonthsAgo <= birthdate && birthdate <= today;

  if (isInFuture) {
    return Nutzergruppe.WERDENDE_ELTERN;
  } else {
    return wasWithinLastThreeMonths
      ? Nutzergruppe.JUNGE_ELTERN
      : Nutzergruppe.NACHBEANTRAGENDE_ELTERN;
  }
}

const TRACKING_VARIABLE_NAME = "nutzergruppe";
