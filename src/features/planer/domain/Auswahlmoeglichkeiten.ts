import type { KeinElterngeld } from "./Auswahloption";
import type { Elterngeldbezug } from "./Elterngeldbezug";
import type { Variante } from "./Variante";

export type Auswahlmoeglichkeiten = Readonly<
  {
    [V in Variante]: Auswahlmoeglichkeit<number>;
  } & { [KeinElterngeld]: Auswahlmoeglichkeit<null> }
>;

export type Auswahlmoeglichkeit<E extends Elterngeldbezug = Elterngeldbezug> =
  | WaehlbareAuswahlmoeglichkeit<E>
  | NichtWaehlbareAuswahlmoeglichkeit;

interface WaehlbareAuswahlmoeglichkeit<E extends Elterngeldbezug>
  extends BasisAuswahlmoeglichkeit<E> {
  istAuswaehlbar: true;
  grundWiesoNichtAuswaehlbar?: undefined;
}

interface NichtWaehlbareAuswahlmoeglichkeit
  extends BasisAuswahlmoeglichkeit<null> {
  istAuswaehlbar: false;
  grundWiesoNichtAuswaehlbar: string;
}

interface BasisAuswahlmoeglichkeit<E extends Elterngeldbezug> {
  readonly elterngeldbezug: E;
  readonly istAuswaehlbar: boolean;
  readonly grundWiesoNichtAuswaehlbar?: string;
}
