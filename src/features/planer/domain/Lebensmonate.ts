import type { Elternteil } from "./Elternteil";
import type { Lebensmonat } from "./Lebensmonat";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";

export type Lebensmonate<E extends Elternteil> = Readonly<
  Partial<Record<Lebensmonatszahl, Lebensmonat<E>>>
>;
