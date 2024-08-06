import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Lebensmonat } from "@/features/planer/domain/lebensmonat";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";

export type Lebensmonate<E extends Elternteil> = Readonly<
  Partial<Record<Lebensmonatszahl, Lebensmonat<E>>>
>;
