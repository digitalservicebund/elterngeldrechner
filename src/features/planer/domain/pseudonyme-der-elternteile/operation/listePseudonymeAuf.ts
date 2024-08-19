import type { PseudonymeDerElternteile } from "@/features/planer/domain/pseudonyme-der-elternteile/PseudonymeDerElternteile";
import { getRecordEntriesWithStringKeys } from "@/features/planer/domain/common/type-safe-records";
import { Elternteil, isElternteil } from "@/features/planer/domain/Elternteil";

export function listePseudonymeAuf<E extends Elternteil>(
  pseudonyme: PseudonymeDerElternteile<E>,
): [E, string][] {
  return getRecordEntriesWithStringKeys(pseudonyme, isElternteil) as [
    E,
    string,
  ][];
}
