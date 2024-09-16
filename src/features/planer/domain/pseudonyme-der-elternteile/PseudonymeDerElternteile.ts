import type { Elternteil } from "@/features/planer/domain/Elternteil";

export type PseudonymeDerElternteile<E extends Elternteil> = Readonly<
  Record<E, string>
>;
