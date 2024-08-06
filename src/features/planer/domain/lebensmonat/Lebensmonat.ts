import type { Elternteil } from "@/features/planer/domain/Elternteil";
import type { Monat } from "@/features/planer/domain/monat";

export type Lebensmonat<E extends Elternteil> = Readonly<Record<E, Monat>>;
