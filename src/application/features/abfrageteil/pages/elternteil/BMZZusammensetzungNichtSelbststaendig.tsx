import { Ausklammerung, Zeitraum } from "@/bemessungszeitraumrechner";
import { formatiereBemessungszeitraum } from "../../domain/formatiereBemessungszeitraum";
import { Temporal } from "@js-temporal/polyfill";

type BMZZusammensetzungNichtSelbststaendigProps = {
  readonly vorname: string;
  readonly bemessungszeitraum: Zeitraum[];
  readonly bemessungszeitraumOhneAusklammerungen: Zeitraum[];
  readonly beruecksichtigteAusklammerungen: Ausklammerung[];
  readonly geburtsdatum: Temporal.PlainDate;
};

export function BMZZusammensetzungNichtSelbststaendig({
  vorname,
  bemessungszeitraum,
  bemessungszeitraumOhneAusklammerungen,
  beruecksichtigteAusklammerungen,
  geburtsdatum,
}: BMZZusammensetzungNichtSelbststaendigProps) {
  const pruefungsergebnis = erstellePruefungsergebnis(
    beruecksichtigteAusklammerungen,
    geburtsdatum,
    Temporal.Now.plainDateISO().year,
  );

  return (
    <div>
      <p>
        Da {vorname} angestellt ist, gilt als Grundlage normalerweise die
        letzten 12 Monate vor dem Monat der Geburt.{" "}
        {beruecksichtigteAusklammerungen.length > 0 && (
          <span>
            Wenn in diesem Zeitraum bestimmte Gründe für ein Überspringen
            (sogenannte Ausklammerungen) vorliegen, werden bestimmte Monate
            nicht mitgezählt. Das passiert, damit das Elterngeld nicht durch den
            Verdienstausfall sinkt.
          </span>
        )}
      </p>
      {beruecksichtigteAusklammerungen.length > 0 && (
        <>
          <p>
            Basierend auf den Angaben haben wir die Berechnungsgrundlage
            geprüft:
          </p>
          <ul>
            <li>
              <strong>Reguläre Grundlage: </strong>Wäre der Zeitraum{" "}
              {formatiereBemessungszeitraum(
                bemessungszeitraumOhneAusklammerungen,
              ).join(" und ")}
              .
            </li>
            {pruefungsergebnis && (
              <li>
                <strong>Die Prüfung ergab: </strong>
                {pruefungsergebnis}
              </li>
            )}
            <li>
              <strong>Neues Berechnungsjahr: </strong>
              Das Elterngeld wird auf Basis des Einkommens von{" "}
              {formatiereBemessungszeitraum(bemessungszeitraum).join(
                " und ",
              )}{" "}
              berechnet.
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

const erstellePruefungsergebnis = (
  beruecksichtigteAusklammerungen: Ausklammerung[],
  geburtsdatum: Temporal.PlainDate,
  currentYear: number,
): string | undefined => {
  if (beruecksichtigteAusklammerungen.length === 0) return undefined;

  const jahre = [
    ...new Set(
      beruecksichtigteAusklammerungen.flatMap((a) => [a.von.year, a.bis.year]),
    ),
  ]
    .sort((a, b) => a - b)
    .filter((year) => year <= geburtsdatum.year);

  const anzahlJahre = jahre.length;
  const enthaeltJahrInZukunft = jahre.includes(currentYear + 1);

  if (anzahlJahre === 1) {
    return `Im Jahr ${jahre[0]} lagen ${enthaeltJahrInZukunft ? "bzw. liegen " : ""}Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.`;
  }

  if (anzahlJahre === 2) {
    return `In den Jahren ${jahre[0]} und ${jahre[1]} lagen ${enthaeltJahrInZukunft ? "bzw. liegen " : ""}Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.`;
  }

  return `In den Jahren ${jahre[0]} bis ${jahre[jahre.length - 1]} lagen ${enthaeltJahrInZukunft ? "bzw. liegen " : ""}Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.`;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  const ausklammerung = (von: string, bis: string): Ausklammerung => ({
    von: Temporal.PlainDate.from(von),
    bis: Temporal.PlainDate.from(bis),
    grund: "test",
  });
  const geburtsdatum = Temporal.PlainDate.from("2026-06-01");

  describe("erstellePruefungsergebnis", () => {
    it("returns undefined when there are no beruecksichtigteAusklammerungen", () => {
      expect(erstellePruefungsergebnis([], geburtsdatum, 2026)).toBeUndefined();
    });

    it("returns a single-year message when all Ausklammerungen fall in one year", () => {
      const result = erstellePruefungsergebnis(
        [ausklammerung("2025-03-01", "2025-10-01")],
        geburtsdatum,
        2026,
      );

      expect(result).toBe(
        "Im Jahr 2025 lagen Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.",
      );
    });

    it("returns a message for two years separated by 'und' when all Ausklammerungen fall in two years next to each other", () => {
      const result = erstellePruefungsergebnis(
        [
          ausklammerung("2025-03-01", "2025-10-01"),
          ausklammerung("2025-01-01", "2025-02-01"),
          ausklammerung("2024-08-01", "2024-11-01"),
        ],
        geburtsdatum,
        2026,
      );

      expect(result).toBe(
        "In den Jahren 2024 und 2025 lagen Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.",
      );
    });

    it("returns a message for two years separated by 'bis' when all Ausklammerungen fall in more than two years", () => {
      const result = erstellePruefungsergebnis(
        [
          ausklammerung("2025-03-01", "2025-10-01"),
          ausklammerung("2025-01-01", "2025-02-01"),
          ausklammerung("2024-08-01", "2024-11-01"),
          ausklammerung("2023-08-15", "2024-07-01"),
        ],
        geburtsdatum,
        2026,
      );

      expect(result).toBe(
        "In den Jahren 2023 bis 2025 lagen Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.",
      );
    });

    it("add 'bzw. liegen' when geburtsdatum is in the next year and an Ausklammerungen touches the next year", () => {
      const result = erstellePruefungsergebnis(
        [ausklammerung("2026-03-01", "2027-01-01")],
        Temporal.PlainDate.from("2027-06-01"),
        2026,
      );

      expect(result).toBe(
        "In den Jahren 2026 und 2027 lagen bzw. liegen Gründe für ein Überspringen vor. Die Monate mit Gründen für ein Überspringen werden komplett ausgelassen.",
      );
    });
  });
}
