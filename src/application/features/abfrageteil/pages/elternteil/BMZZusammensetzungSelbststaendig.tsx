import { Zeitraum } from "@/bemessungszeitraumrechner";
import { Temporal } from "@js-temporal/polyfill";

type BMZZusammensetzungSelbststaendigProps = {
  readonly istMischeinkunft: boolean;
  readonly vorname: string;
  readonly bemessungszeitraum: Zeitraum[];
  readonly geburtsdatum: Temporal.PlainDate;
};

export function BMZZusammensetzungSelbststaendig({
  istMischeinkunft,
  vorname,
  bemessungszeitraum,
  geburtsdatum,
}: BMZZusammensetzungSelbststaendigProps) {
  const regulaeresJahr = geburtsdatum.year - 1;
  const ersterZeitraum = bemessungszeitraum[0];
  const abstandZwischenJahren = ersterZeitraum
    ? regulaeresJahr - ersterZeitraum.von.year
    : 0;

  const pruefungsergebnis = ersterZeitraum
    ? erstellePruefungsergebnis(regulaeresJahr, ersterZeitraum.von.year)
    : undefined;

  return (
    <div>
      <p>
        Da {vorname} selbstständig{" "}
        {istMischeinkunft ? "und angestellt arbeitet" : "ist"}, gilt als
        Grundlage normalerweise das letzte Kalenderjahr vor der Geburt.{" "}
        {ersterZeitraum && abstandZwischenJahren > 0 && (
          <span>
            Wenn in diesem Zeitraum jedoch bestimmte Gründe für ein Überspringen
            (sogenannte Ausklammerungen) vorliegen, wird das gesamte betroffene
            Kalenderjahr ausgelassen. Das passiert, damit das Elterngeld nicht
            durch den Verdienstausfall sinkt.
          </span>
        )}
      </p>
      {ersterZeitraum && abstandZwischenJahren > 0 && (
        <>
          <p>
            Basierend auf den Angaben haben wir die Berechnungsgrundlage
            geprüft:
          </p>
          <ul>
            <li>
              <strong>Reguläre Grundlage: </strong>Wäre das Kalenderjahr vor der
              Geburt gewesen.
            </li>
            {pruefungsergebnis && (
              <li>
                <strong>Die Prüfung ergab: </strong>
                {pruefungsergebnis}
              </li>
            )}
            <li>
              <strong>Neues Berechnungsjahr: </strong>
              Das Elterngeld wird auf Basis des Einkommens aus{" "}
              {ersterZeitraum.bis.year} berechnet.
            </li>
          </ul>
        </>
      )}
    </div>
  );
}

const erstellePruefungsergebnis = (
  regulaeresJahr: number,
  bmzStartJahr: number,
): string | undefined => {
  const abstandZwischenJahren = regulaeresJahr - bmzStartJahr;

  if (abstandZwischenJahren < 1) return undefined;

  if (abstandZwischenJahren === 1) {
    return `Im Jahr ${regulaeresJahr} lagen Gründe für ein Überspringen vor. Dieses Jahr wird komplett ausgelassen.`;
  }

  if (abstandZwischenJahren === 2) {
    return `In den Jahren ${regulaeresJahr - 1} und ${regulaeresJahr} lagen Gründe für ein Überspringen vor. Diese Jahre werden komplett ausgelassen.`;
  }

  const startLuecke = bmzStartJahr + 1;
  const endeLuecke = regulaeresJahr;

  return `In den Jahren ${startLuecke} bis ${endeLuecke} lagen Gründe für ein Überspringen vor. Diese Jahre werden komplett ausgelassen.`;
};

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("erstellePruefungsergebnis", () => {
    it("returns undefined when bmzStartJahr equals regulaeresJahr (no shift)", () => {
      expect(erstellePruefungsergebnis(2025, 2025)).toBeUndefined();
    });

    it("returns string with one year when bmzStartJahr is moved back one year", () => {
      const expected =
        "Im Jahr 2025 lagen Gründe für ein Überspringen vor. Dieses Jahr wird komplett ausgelassen.";

      expect(erstellePruefungsergebnis(2025, 2024)).toEqual(expected);
    });

    it("returns string with two years separated with und when bmzStartJahr is moved back two years", () => {
      const expected =
        "In den Jahren 2024 und 2025 lagen Gründe für ein Überspringen vor. Diese Jahre werden komplett ausgelassen.";

      expect(erstellePruefungsergebnis(2025, 2023)).toEqual(expected);
    });

    it("returns string with two years separated with bis when bmzStartJahr is moved back more than two years (exactly three)", () => {
      const expected =
        "In den Jahren 2023 bis 2025 lagen Gründe für ein Überspringen vor. Diese Jahre werden komplett ausgelassen.";

      expect(erstellePruefungsergebnis(2025, 2022)).toEqual(expected);
    });

    it("returns string with two years separated with bis when bmzStartJahr is moved back more than two years (more than three)", () => {
      const expected =
        "In den Jahren 2022 bis 2025 lagen Gründe für ein Überspringen vor. Diese Jahre werden komplett ausgelassen.";

      expect(erstellePruefungsergebnis(2025, 2021)).toEqual(expected);
    });
  });
}
