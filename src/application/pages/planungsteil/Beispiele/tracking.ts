import {
  pushTrackingEvent,
  setTrackingVariable,
} from "@/application/user-tracking";

export function trackMetricsForEinBeispielWurdeAusgewaehlt(beispiel: {
  identifier: string;
}): void {
  setTrackingVariable(
    "Identifier-des-ausgewaehlten-Beispiels-im-Planer",
    beispiel.identifier,
  );

  pushTrackingEvent("Beispiel-wurde-im-Planer-ausgewählt");
}
