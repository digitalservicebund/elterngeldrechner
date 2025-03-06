import { type Lohnsteuerjahr } from "./Lohnsteuerjahr";
import {
  type Ausgangsparameter,
  type Eingangsparameter,
  PAP_2021,
  PAP_2022,
  PAP_2023,
  PAP_2024,
  type Programmablaufplan,
} from "./programmablaufplan";

export function berechneLohnsteuer(
  lohnsteuerjahr: Lohnsteuerjahr,
  eingangsparameter: Eingangsparameter,
): Ausgangsparameter {
  const programm = new ABLAUFPLAENE[lohnsteuerjahr](eingangsparameter);
  return programm.ausfuehren();
}

const ABLAUFPLAENE = {
  2021: PAP_2021,
  2022: PAP_2022,
  2023: PAP_2023,
  2024: PAP_2024,
} satisfies Record<
  Lohnsteuerjahr,
  { new (eingangsparameter: Eingangsparameter): Programmablaufplan }
>;
