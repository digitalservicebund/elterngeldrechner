import {
  KeinElterngeld,
  PlanMitBeliebigenElternteilen,
} from "@/features/planer/domain";

import { setTrackingVariable } from "@/user-tracking/data-layer";
import { MatomoTrackingMetrics } from "@/features/planer/domain/plan";

export function trackPlanung(
  plan: PlanMitBeliebigenElternteilen & MatomoTrackingMetrics,
) {
  trackCountOfResets(plan);
  trackCountOfChanges(plan);
  trackCountOfPlannedMonths(plan);
  trackCountOfPlannedMonthsWithIncome(plan);
}

function trackCountOfPlannedMonths(plan: PlanMitBeliebigenElternteilen) {
  const sum = Object.values(plan.lebensmonate)
    .map(
      (it) =>
        Object.values(it).filter(
          (monat) =>
            monat.gewaehlteOption && monat.gewaehlteOption !== KeinElterngeld,
        ).length,
    )
    .reduce((partialSum, a) => partialSum + a, 0);

  setTrackingVariable("geplante-monate", sum);
}

function trackCountOfPlannedMonthsWithIncome(
  plan: PlanMitBeliebigenElternteilen,
) {
  const length = Object.values(plan.lebensmonate).filter((it) =>
    Object.values(it).some(
      (monat) =>
        (monat.bruttoeinkommen || 0) > 0 &&
        monat.gewaehlteOption &&
        monat.gewaehlteOption !== KeinElterngeld,
    ),
  ).length;

  setTrackingVariable("geplante-monate-mit-einkommen", length);
}

function trackCountOfChanges(metrics: MatomoTrackingMetrics) {
  setTrackingVariable("aenderungen-am-plan", metrics.changes);
}

function trackCountOfResets(metrics: MatomoTrackingMetrics) {
  setTrackingVariable("wiederholungen-des-plans", metrics.resets);
}
