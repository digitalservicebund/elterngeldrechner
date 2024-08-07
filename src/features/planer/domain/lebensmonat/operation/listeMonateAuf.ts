import type { Monat } from "@/features/planer/domain/monat";
import { getRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import { Elternteil, isElternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";

export function listeMonateAuf<E extends Elternteil>(
  lebensmonat: Lebensmonat<E>,
): [E, Monat][] {
  return getRecordEntriesWithStringKeys(lebensmonat, isElternteil);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("lists Elternteile mit jeweiligem Monat as entry pairs", () => {
    const entries = listeMonateAuf({
      [Elternteil.Eins]: { elterngeldbezug: 10, imMutterschutz: false },
      [Elternteil.Zwei]: { elterngeldbezug: 20, imMutterschutz: false },
    });

    expect(entries).toHaveLength(2);
    expect(entries).toStrictEqual([
      [Elternteil.Eins, { elterngeldbezug: 10, imMutterschutz: false }],
      [Elternteil.Zwei, { elterngeldbezug: 20, imMutterschutz: false }],
    ]);
  });
}
