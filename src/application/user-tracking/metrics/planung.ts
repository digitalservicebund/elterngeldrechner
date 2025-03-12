import {
  getTrackingVariable,
  setTrackingVariable,
} from "@/application/user-tracking/core";
import { Monat, PlanMitBeliebigenElternteilen } from "@/monatsplaner";

enum Variables {
  Changes = "aenderungen-am-plan",
  PlannedMonths = "geplante-monate",
  PlannedMonthsWithIncome = "geplante-monate-mit-einkommen",
}

export function resetTrackingPlanung() {
  Object.values(Variables).forEach((key) => setTrackingVariable(key, 0));
}

export function trackChanges() {
  const newChanges = (getTrackingVariable<number>(Variables.Changes) || 0) + 1;

  setTrackingVariable(Variables.Changes, newChanges);
}

export function trackPlannedMonths(plan: PlanMitBeliebigenElternteilen) {
  const count = countMatchingMonate(plan, (monat) => {
    return !!monat.gewaehlteOption;
  });

  setTrackingVariable(Variables.PlannedMonths, count);
}

export function trackPlannedMonthsWithIncome(
  plan: PlanMitBeliebigenElternteilen,
) {
  const count = countMatchingMonate(plan, (monat) => {
    return !!(
      monat.bruttoeinkommen &&
      monat.bruttoeinkommen > 0 &&
      monat.gewaehlteOption
    );
  });

  setTrackingVariable(Variables.PlannedMonthsWithIncome, count);
}

function countMatchingMonate(
  plan: PlanMitBeliebigenElternteilen,
  predicate: (monat: Monat) => boolean,
) {
  return Object.values(plan.lebensmonate)
    .map((it) => Object.values(it).filter(predicate).length)
    .reduce((partialSum, a) => partialSum + a, 0);
}
