const ORDNUNGSZAHLEN_BIS_ZWOELF = [
  "erste",
  "zweite",
  "dritte",
  "vierte",
  "fünfte",
  "sechste",
  "siebte",
  "achte",
  "neunte",
  "zehnte",
  "elfte",
  "zwölfte",
];

export function formatiereOrdnungszahlAlsWort(zahl: number): string {
  return ORDNUNGSZAHLEN_BIS_ZWOELF[zahl - 1] ?? `${zahl}.`;
}

const KARDINALZAHLEN_BIS_ZWOELF = [
  "eine",
  "zwei",
  "drei",
  "vier",
  "fünf",
  "sechs",
  "sieben",
  "acht",
  "neun",
  "zehn",
  "elf",
  "zwölf",
];

export function formatiereKardinalzahlAlsWort(zahl: number): string {
  return KARDINALZAHLEN_BIS_ZWOELF[zahl - 1] ?? `${zahl}`;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("formatiereOrdnungszahlAlsWort", () => {
    it("spells out ordinals from 1 to 12", () => {
      expect(formatiereOrdnungszahlAlsWort(1)).toBe("erste");
      expect(formatiereOrdnungszahlAlsWort(2)).toBe("zweite");
      expect(formatiereOrdnungszahlAlsWort(12)).toBe("zwölfte");
    });

    it("falls back to a numeral with a trailing dot beyond 12", () => {
      expect(formatiereOrdnungszahlAlsWort(13)).toBe("13.");
    });
  });

  describe("formatiereKardinalzahlAlsWort", () => {
    it("spells out cardinals from 1 to 12", () => {
      expect(formatiereKardinalzahlAlsWort(1)).toBe("eine");
      expect(formatiereKardinalzahlAlsWort(2)).toBe("zwei");
      expect(formatiereKardinalzahlAlsWort(12)).toBe("zwölf");
    });

    it("falls back to a plain numeral beyond 12", () => {
      expect(formatiereKardinalzahlAlsWort(13)).toBe("13");
    });
  });
}
