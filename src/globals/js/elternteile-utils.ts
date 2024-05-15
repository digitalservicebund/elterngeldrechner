import { DateTime } from "luxon";
import { YesNo } from "@/globals/js/calculations/model";
import {
  CreateElternteileSettings,
  ElternteilType,
  Geburtstag,
} from "@/monatsplaner";

namespace NumberOfMutterschutzMonths {
  export const oneChild = 2;
  export const moreThanOneChild = 3;
}

export const numberOfMutterschutzMonths = (
  anzahlKuenftigerKinder: number,
  hasMutterschutz: YesNo | null,
): number => {
  if (hasMutterschutz === "YES") {
    return anzahlKuenftigerKinder === 1
      ? NumberOfMutterschutzMonths.oneChild
      : NumberOfMutterschutzMonths.moreThanOneChild;
  } else {
    return 0;
  }
};

export const createDefaultElternteileSettings = (
  mehrlinge: boolean,
  behindertesGeschwisterkind: boolean,
  isoGeburtstag: string,
  mutterschutzElternteil: ElternteilType,
  numberOfMutterschutzMonths: number,
  partnerMonate: boolean,
): CreateElternteileSettings => {
  const geburtstag: Geburtstag = {
    geburt: isoGeburtstag,
    errechnet: isoGeburtstag,
  };

  let settings: CreateElternteileSettings = {
    mehrlinge,
    behindertesGeschwisterkind,
    geburtstag,
    partnerMonate,
  };

  if (numberOfMutterschutzMonths) {
    const mutterschutz = {
      elternteil: mutterschutzElternteil,
      endDate: DateTime.fromISO(isoGeburtstag)
        .plus({
          month: numberOfMutterschutzMonths,
        })
        // Due to ed-monatsplaner-app API substract one day
        // for each Mutterschafts Monat - explanation:
        // In ElternGeld Digital taking on day of Mutterschafszeit
        // should set the whole month as Mutterschafszeit. Therefore
        // calculating the amount of Mutterschafs Monate Math.ceil is used.
        // But the used luxon lib takes 30 day as a month.
        // For the EGR use case this yields to wrong results.
        // The EGR should set two or three month of Mutterschafts Monate.
        // Pragmatic fix: substract one day of each Mutterschafts Month (just for calculation purpose)
        .plus({ days: numberOfMutterschutzMonths * -1 })
        .toUTC()
        .toISO({ suppressMilliseconds: true }) as string,
    };

    settings = { ...settings, mutterschutz };
  }

  return settings;
};
