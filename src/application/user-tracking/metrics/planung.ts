import { setTrackingVariable } from "@/application/user-tracking/core";

/**
 * The Partner:in of the Mutter is the Elternteil without Mutterschaftsleistung.
 * That means this only applies if there are more than one Elternteil and if any
 * of them receives Mutterschaftsleistungen.
 * Geplante Monate are only those where the Partner:in receives Elterngeld.
 */
export function trackAnzahlGeplanterMonateDesPartnersDerMutter(
  anzahlGeplanterMonate: number,
): void {
  setTrackingVariable(
    "anzahlGeplanterMonateDesPartnersDerMutter",
    anzahlGeplanterMonate,
  );
}
