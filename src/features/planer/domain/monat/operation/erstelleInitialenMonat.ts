import {
  MONAT_MIT_MUTTERSCHUTZ,
  Monat,
} from "@/features/planer/domain/monat/Monat";
import { Variante } from "@/features/planer/domain/Variante";

export function erstelleInitialenMonat(imMutterschutz: boolean): Monat {
  return imMutterschutz ? MONAT_MIT_MUTTERSCHUTZ : { imMutterschutz: false };
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("creates fully set Monat mit Mutterschutz", () => {
    const monat = erstelleInitialenMonat(true);

    expect(monat.imMutterschutz).toBe(true);
    expect(monat.gewaehlteOption).toBe(Variante.Basis);
    expect(monat.elterngeldbezug).toBe(null);
  });

  it("creates Monat mit Auswahl with initially empty fields", () => {
    const monat = erstelleInitialenMonat(false);

    expect(monat.imMutterschutz).toBe(false);
    expect(monat.gewaehlteOption).toBeUndefined();
    expect(monat.elterngeldbezug).toBeUndefined();
  });
}
