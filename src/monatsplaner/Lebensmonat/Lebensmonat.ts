import type { Elternteil } from "@/monatsplaner/Elternteil";
import type { Monat } from "@/monatsplaner/Monat";

export type Lebensmonat<E extends Elternteil> = Readonly<Record<E, Monat>>;

export type LebensmonatMitBeliebigenElternteilen = Readonly<
  Partial<Record<Elternteil, Monat>>
>;
