import { Elternteil } from "@/features/planer/domain/Elternteil";

export type PseudonymeDerElternteile<E extends Elternteil> = [E] extends [
  Elternteil.Eins,
]
  ? undefined
  : Readonly<Record<E, string>>;
