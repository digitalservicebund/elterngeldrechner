import { Elternteil } from "@/monatsplaner/Elternteil";

export type NamenDerElternteile<E extends Elternteil> = [E] extends [
  Elternteil.Eins,
]
  ? undefined
  : Readonly<Record<E, string>>;
