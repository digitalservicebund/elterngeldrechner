import type { Lebensmonat } from "@/features/planer/domain/lebensmonat/Lebensmonat";
import { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonate } from "@/features/planer/domain/lebensmonate/Lebensmonate";
import { getRecordEntriesWithIntegerKeys } from "@/features/planer/domain/common/type-safe-records";
import {
  isLebensmonatszahl,
  type Lebensmonatszahl,
} from "@/features/planer/domain/Lebensmonatszahl";

export function listeLebensmonateAuf<E extends Elternteil>(
  lebensmonate: Lebensmonate<E>,
): [Lebensmonatszahl, Lebensmonat<E>][] {
  return getRecordEntriesWithIntegerKeys(lebensmonate, isLebensmonatszahl);
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("lists Lebensmonatszahlem mit jeweiligen Lebensmonat as entry pairs", () => {
    const entries = listeLebensmonateAuf({
      1: ANY_LEBENSMONAT,
      5: ANY_LEBENSMONAT,
    });

    expect(entries).toHaveLength(2);
    expect(entries).toStrictEqual([
      [1, ANY_LEBENSMONAT],
      [5, ANY_LEBENSMONAT],
    ]);
  });
}

const ANY_LEBENSMONAT: Lebensmonat<Elternteil.Eins> = {
  [Elternteil.Eins]: { imMutterschutz: false },
};
