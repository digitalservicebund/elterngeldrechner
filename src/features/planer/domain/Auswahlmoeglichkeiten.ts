import type { KeinElterngeld } from "./Auswahloption";
import type { Elterngeldbezug } from "./Elterngeldbezug";
import type { Variante } from "./Variante";

export type Auswahlmoeglichkeiten = Readonly<
  {
    [V in Variante]: Auswahlmoeglichkeit<number>;
  } & { [KeinElterngeld]: Auswahlmoeglichkeit<null> }
>;

export type Auswahlmoeglichkeit<E extends Elterngeldbezug = Elterngeldbezug> =
  | EnabledAuswahlmoeglichkeit<E>
  | DisabledAuswahlmoeglichkeit;

interface EnabledAuswahlmoeglichkeit<E extends Elterngeldbezug>
  extends BasisAuswahlmoeglichkeit<E> {
  isDisabled: false;
  hintWhyDisabled?: undefined;
}

interface DisabledAuswahlmoeglichkeit extends BasisAuswahlmoeglichkeit<null> {
  isDisabled: true;
  hintWhyDisabled: string;
}

interface BasisAuswahlmoeglichkeit<E extends Elterngeldbezug> {
  readonly elterngeldbezug: E;
  readonly isDisabled: boolean;
  readonly hintWhyDisabled?: string;
}
