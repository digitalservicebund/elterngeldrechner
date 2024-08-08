import {
  Auswahloption,
  Auswahloptionen,
} from "@/features/planer/domain/Auswahloption";
import { Variante } from "@/features/planer/domain/Variante";
import {
  MONAT_MIT_MUTTERSCHUTZ,
  Monat,
} from "@/features/planer/domain/monat/Monat";

export function waehleOption(monat: Monat, option: Auswahloption): Monat {
  if (monat.imMutterschutz && option === Variante.Basis) {
    return monat;
  } else {
    return {
      ...monat,
      gewaehlteOption: option,
      imMutterschutz: false as const,
    };
  }
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("keeps the Monat untouched if it is a Monat mit Mutterschutz and Basiselterngeld is chosen", () => {
    const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, Variante.Basis);

    expect(monat).toBe(MONAT_MIT_MUTTERSCHUTZ);
  });

  it.each(Auswahloptionen.filter((option) => option !== Variante.Basis))(
    "changes Monat im Mutterschatz to not be im Mutterschutz if chosing %s",
    (option) => {
      const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, option);

      expect(monat).not.toBe(MONAT_MIT_MUTTERSCHUTZ);
      expect(monat.imMutterschutz).toBe(false);
    },
  );

  it.each(Auswahloptionen)(
    "sets the gewählte Option of the Monat to %s",
    (option) => {
      const monat = waehleOption(MONAT_MIT_MUTTERSCHUTZ, option);

      expect(monat.gewaehlteOption).toBe(option);
    },
  );
}
