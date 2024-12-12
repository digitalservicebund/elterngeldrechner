import {
  PAP_2023,
  type Ausgangsparameter,
  type Eingangsparameter,
  type Programmablaufplan,
} from "./programmablaufplan";

export { type Eingangsparameter, Ausgangsparameter };

export function berechneSteuerUndSozialabgaben(
  lohnsteuerjahr: Lohnsteuerjahr,
  eingangsparameter: Eingangsparameter,
): Ausgangsparameter {
  const programm = new ABLAUFPLAENE[lohnsteuerjahr](eingangsparameter);
  return programm.ausfuehren();
}

const ABLAUFPLAENE = {
  2023: PAP_2023,
} satisfies Record<
  Lohnsteuerjahr,
  { new (eingangsparameter: Eingangsparameter): Programmablaufplan }
>;

export type Lohnsteuerjahr = 2023;
