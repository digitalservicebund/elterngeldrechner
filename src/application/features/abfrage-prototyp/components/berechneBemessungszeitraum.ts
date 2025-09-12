import { PersonPageFlow } from "./PersonPageRouting";

const formattedDate = (date: Date) => {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function berechneMaximalenBemessungszeitraum(
  geburtsdatum: Date,
): string[] {
  return [
    `im Kalenderjahr ${geburtsdatum.getFullYear() - 1}`,
    `und vom ${formattedDate(new Date(geburtsdatum.getFullYear(), 0, 1))} bis ${formattedDate(geburtsdatum)}`,
  ];
}

export function berechneUngefaehrenBemessungszeitraum(
  geburtsdatum: Date,
  flow: PersonPageFlow,
): string {
  if (
    flow === PersonPageFlow.selbststaendig ||
    flow === PersonPageFlow.mischeinkuenfte
  ) {
    return `Kalenderjahr ${geburtsdatum.getFullYear() - 1}`;
  }
  return ``;
}
