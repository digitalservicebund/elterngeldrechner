import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type {
  Lebensmonat,
  LebensmonatMitBeliebigenElternteilen,
} from "@/features/planer/domain/lebensmonat";
import type { Lebensmonatszahl } from "@/features/planer/domain/Lebensmonatszahl";

export type Lebensmonate<E extends Elternteil> = Readonly<
  Partial<Record<Lebensmonatszahl, Lebensmonat<E>>>
>;

/**
 * CAREFUL:
 * This type is quite unstable and does not give any guarantees that the
 * Elternteile are the same across all Lebensmonate.
 */
export type LebensmonateMitBeliebigenElternteilen = Readonly<
  Partial<Record<Lebensmonatszahl, LebensmonatMitBeliebigenElternteilen>>
>;
