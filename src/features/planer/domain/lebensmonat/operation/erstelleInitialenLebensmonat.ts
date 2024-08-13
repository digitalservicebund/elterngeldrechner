import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import { erstelleInitialenMonat } from "@/features/planer/domain/monat";
import type {
  Ausgangslage,
  ElternteileByAusgangslage,
} from "@/features/planer/domain/ausgangslage";

export function erstelleInitialenLebensmonat<A extends Ausgangslage>(
  ausgangslage: A,
  lebensmonatszahl: Lebensmonatszahl,
): Lebensmonat<ElternteileByAusgangslage<A>> {
  const { anzahlElternteile, informationenZumMutterschutz } = ausgangslage;
  const letzterLebensmonatMitSchutz =
    informationenZumMutterschutz?.letzterLebensmonatMitSchutz ?? 0;

  const hatMonatMitMutterschutz =
    lebensmonatszahl <= letzterLebensmonatMitSchutz;

  const mutterschutzempfaenger = informationenZumMutterschutz?.empfaenger;

  switch (anzahlElternteile) {
    case 1:
      return {
        [Elternteil.Eins]: erstelleInitialenMonat(
          hatMonatMitMutterschutz && mutterschutzempfaenger === Elternteil.Eins,
        ),
      } as Lebensmonat<ElternteileByAusgangslage<A>>;

    case 2:
      return {
        [Elternteil.Eins]: erstelleInitialenMonat(
          hatMonatMitMutterschutz && mutterschutzempfaenger === Elternteil.Eins,
        ),
        [Elternteil.Zwei]: erstelleInitialenMonat(
          hatMonatMitMutterschutz && mutterschutzempfaenger === Elternteil.Zwei,
        ),
      } as Lebensmonat<ElternteileByAusgangslage<A>>;
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("has only an entry for single Elternteil if Ausgangslage für ein Elternteil", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      { anzahlElternteile: 1 },
      ANY_LEBENSMONATS_ZAHL,
    );

    expect(Object.keys(lebensmonat)).toEqual([Elternteil.Eins]);
  });

  it("has an entry for two Elternteile if Ausgangslage für zwei Elternteile", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      { anzahlElternteile: 2 },
      ANY_LEBENSMONATS_ZAHL,
    );

    expect(Object.keys(lebensmonat).sort()).toEqual(
      [Elternteil.Eins, Elternteil.Zwei].sort(),
    );
  });

  it("erstellt Monate ohne Mutterschutz if no Informationen zum Mutterschutz are given", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      { informationenZumMutterschutz: undefined, anzahlElternteile: 2 },
      ANY_LEBENSMONATS_ZAHL,
    );

    Object.values(lebensmonat).forEach((monat) =>
      expect(monat.imMutterschutz).toBe(false),
    );
  });

  it("erstellt a Monat mit Mutterschutz if the Lebensmonatszahl in the range of the configured Mutterschutz", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      {
        anzahlElternteile: 1,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Eins,
          letzterLebensmonatMitSchutz: 2,
        },
      },
      1,
    );

    expect(lebensmonat[Elternteil.Eins].imMutterschutz).toBe(true);
  });

  it("erstellt no Monat mit Mutterschutz if the Lebensmonatszahl is not in the range of the configured Mutterschutz", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      {
        anzahlElternteile: 1,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Eins,
          letzterLebensmonatMitSchutz: 2,
        },
      },
      3,
    );

    expect(lebensmonat[Elternteil.Eins].imMutterschutz).toBe(false);
  });

  it("erstellt Monat mit Mutterschutz for the configured Mutterschutzempfänger", () => {
    const lebensmonat = erstelleInitialenLebensmonat(
      {
        anzahlElternteile: 2,
        informationenZumMutterschutz: {
          empfaenger: Elternteil.Zwei,
          letzterLebensmonatMitSchutz: 2,
        },
      },
      2,
    );

    expect(lebensmonat[Elternteil.Eins].imMutterschutz).toBe(false);
    expect(lebensmonat[Elternteil.Zwei].imMutterschutz).toBe(true);
  });

  const ANY_LEBENSMONATS_ZAHL = 1;
}
