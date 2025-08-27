import type { Elternteil } from "./Elternteil";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";
import type { Monat } from "./Monat";

export type Elterngeldbezug = number | null;

export type Elterngeldbezuege = Readonly<
  Partial<Record<Lebensmonatszahl, Elterngeldbezug>>
>;

// The callback is used to provide a calculation function
// to the operations in the monatsplaner in order to achieve
// dependency inversion and keep the dependencies unidirectional.
export type BerechneElterngeldbezuegeCallback = (
  elternteil: Elternteil,
  monate: Readonly<Partial<Record<Lebensmonatszahl, Monat>>>,
) => Elterngeldbezuege;
