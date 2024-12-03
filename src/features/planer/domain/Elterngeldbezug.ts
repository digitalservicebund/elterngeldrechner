import type { Elternteil } from "./Elternteil";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";
import type { Monat } from "./monat";

export type Elterngeldbezug = number | null;

export type ElterngeldbezuegeFuerElternteil = Readonly<
  Partial<Record<Lebensmonatszahl, Elterngeldbezug>>
>;

export type BerechneElterngeldbezuegeCallback = (
  elternteil: Elternteil,
  monate: Readonly<Partial<Record<Lebensmonatszahl, Monat>>>,
) => ElterngeldbezuegeFuerElternteil;
