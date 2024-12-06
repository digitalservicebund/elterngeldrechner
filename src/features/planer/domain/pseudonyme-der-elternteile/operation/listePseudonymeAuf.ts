import type { PseudonymeDerElternteile } from "@/features/planer/domain/pseudonyme-der-elternteile/PseudonymeDerElternteile";
import { getRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import {
  compareElternteile,
  type Elternteil,
  isElternteil,
} from "@/features/planer/domain/Elternteil";

export function listePseudonymeAuf<E extends Elternteil>(
  pseudonyme: PseudonymeDerElternteile<E>,
  sortByElternteil = false,
): [E, string][] {
  const unsorted = getRecordEntriesWithStringKeys(pseudonyme, isElternteil);

  return sortByElternteil
    ? unsorted.sort(([left], [right]) => compareElternteile(left, right))
    : unsorted;
}

if (import.meta.vitest) {
  const { describe, it, expect } = import.meta.vitest;

  describe("liste Pseudonyme auf", async () => {
    const { Elternteil } = await import("@/features/planer/domain/Elternteil");

    it("lists Elternteile with matching Pseudonym as entry pairs in correct order", () => {
      const pseudonyme = {
        [Elternteil.Zwei]: "John",
        [Elternteil.Eins]: "Jane",
      };

      const entries = listePseudonymeAuf(pseudonyme, true);

      expect(entries).toStrictEqual([
        [Elternteil.Eins, "Jane"],
        [Elternteil.Zwei, "John"],
      ]);
    });
  });
}
