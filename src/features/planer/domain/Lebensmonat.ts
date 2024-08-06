import type { Elternteil } from "./Elternteil";
import type { Monat } from "./Monat";

export type Lebensmonat<E extends Elternteil> = Readonly<Record<E, Monat>>;
