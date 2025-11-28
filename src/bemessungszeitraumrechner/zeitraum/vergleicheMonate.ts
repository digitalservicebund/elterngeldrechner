import { naechsterMonat } from "./manipuliereMonate";

export function istMonatFolgend(vormonat: Date, folgemonat: Date): boolean {
  return naechsterMonat(vormonat).getTime() === folgemonat.getTime();
}
