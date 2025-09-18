import { PersonPageFlow } from "./PersonPageRouting";

const formattedDate = (date: Date) => {
  return date.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

function formatRelativeMonth(baseDate: Date, monthsBack: number): string {
  const date = new Date(baseDate);
  date.setMonth(date.getMonth() - monthsBack);

  return date.toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
  });
}

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
  return `${formatRelativeMonth(geburtsdatum, 12)} bis ${formatRelativeMonth(geburtsdatum, 1)}`;
}

export type Ausklammerung = {
  beschreibung: string;
  von: Date;
  bis: Date;
};

function berechneMonateFuerGenauenBemessungszeitraum(
  geburtsdatum: Date,
  auszuklammerndeZeitraeume: Ausklammerung[],
): Date[] {
  const monate: Date[] = [];

  let current = new Date(
    geburtsdatum.getFullYear(),
    geburtsdatum.getMonth() - 1,
    1,
  );

  while (monate.length < 12) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const istAusgeklammert = auszuklammerndeZeitraeume.some(
      ({ von, bis }) => von <= monthEnd && bis >= monthStart,
    );

    if (!istAusgeklammert) {
      monate.push(monthStart);
    }

    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
  }

  return monate;
}

export function berechneGenauenBemessungszeitraum(
  geburtsdatum: Date,
  flow: PersonPageFlow,
  auszuklammerndeZeitraeume: Ausklammerung[],
): string {
  if (
    flow === PersonPageFlow.selbststaendig ||
    flow === PersonPageFlow.mischeinkuenfte
  ) {
    return `Kalenderjahr ${geburtsdatum.getFullYear() - 1}`;
  }

  const monate: Date[] = berechneMonateFuerGenauenBemessungszeitraum(
    geburtsdatum,
    auszuklammerndeZeitraeume,
  );

  const ersterMonat = monate[monate.length - 1];
  const letzterMonat = monate[0];

  if (!ersterMonat || !letzterMonat) {
    return "kein Zeitraum verfügbar";
  }

  const format = (date: Date) =>
    date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  return `${format(ersterMonat)} bis ${format(letzterMonat)}`;
}

export function berechneExaktenBemessungszeitraum(
  geburtsdatum: Date,
  flow: PersonPageFlow,
  auszuklammerndeZeitraeume: Ausklammerung[],
): string {
  if (
    flow === PersonPageFlow.selbststaendig ||
    flow === PersonPageFlow.mischeinkuenfte
  ) {
    return `Kalenderjahr ${geburtsdatum.getFullYear() - 1}`;
  }

  const monate: Date[] = berechneMonateFuerGenauenBemessungszeitraum(
    geburtsdatum,
    auszuklammerndeZeitraeume,
  ).sort((a, b) => a.getTime() - b.getTime());

  if (monate.length === 0) {
    return "kein Zeitraum verfügbar";
  }

  const zeitraeume: { start: Date; end: Date }[] = [];
  let start = monate[0];
  let prev = monate[0];

  for (let i = 1; i < monate.length; i++) {
    const aktueller = monate[i];

    const diffInMonths =
      aktueller!.getFullYear() * 12 +
      aktueller!.getMonth() -
      (prev!.getFullYear() * 12 + prev!.getMonth());

    if (diffInMonths > 1 && start && prev) {
      zeitraeume.push({ start, end: prev });
      start = aktueller;
    }

    prev = aktueller;
  }

  if (start && prev) {
    zeitraeume.push({ start, end: prev });
  }

  const format = (date: Date) =>
    date.toLocaleDateString("de-DE", { month: "long", year: "numeric" });

  return zeitraeume
    .map(({ start, end }) => `${format(start)} bis ${format(end)}`)
    .join(" & ");
}
