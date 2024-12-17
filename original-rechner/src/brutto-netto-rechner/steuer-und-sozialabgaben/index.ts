import {
  PAP_2022,
  PAP_2023,
  type Ausgangsparameter,
  type Eingangsparameter,
  type Programmablaufplan,
} from "./programmablaufplan";
import type { Lohnsteuerjahr } from "../../model";

export { type Eingangsparameter };

export function berechneSteuerUndSozialabgaben(
  lohnsteuerjahr: Lohnsteuerjahr,
  eingangsparameter: Eingangsparameter,
): Ausgangsparameter {
  const programm = new ABLAUFPLAENE[lohnsteuerjahr](eingangsparameter);
  return programm.ausfuehren();
}

const ABLAUFPLAENE = {
  2022: PAP_2022,
  2023: PAP_2023,
} satisfies Record<
  Lohnsteuerjahr,
  { new (eingangsparameter: Eingangsparameter): Programmablaufplan }
>;
