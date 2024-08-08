import type { Elternteil } from "./Elternteil";
import type { Lebensmonatszahl } from "./Lebensmonatszahl";
import type { Variante } from "./Variante";

export type Elterngeldbezuege<E extends Elternteil> = Readonly<
  Record<Lebensmonatszahl, ElterngeldbezeugeProElternteil<E>>
>;

export type ElterngeldbezeugeProElternteil<E extends Elternteil> = Readonly<
  Record<E, ElterngeldbezugProVariante>
>;

export type ElterngeldbezugProVariante = Readonly<Record<Variante, number>>;
