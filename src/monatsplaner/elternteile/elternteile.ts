import { Elternteil, Elternteile, Month } from "./elternteile-types";
import {
  CreateElternteileSettings,
  getGeburtstagSettings,
  getPartnerMonateSettings,
  hasMutterschutzSettings,
} from "./elternteile-setting";
import { getBEGAnspruch } from "./beg-anspruch";
import { getNumberOfMutterschutzMonths } from "./mutterschutz-calculator";
import {
  maxNumberOfPartnerschaftbonus,
  numberOfLebensmonate,
} from "@/monatsplaner/configuration";

export const createElternteile = (
  settings?: CreateElternteileSettings,
): Elternteile => {
  const emptyMonth: Month = {
    type: "None",
    isMutterschutzMonth: false,
  };

  const emptyMonths: Month[] = Array.from<Month>({
    length: numberOfLebensmonate,
  }).fill(emptyMonth);

  let begAnspruch = getBEGAnspruch(getGeburtstagSettings(settings));
  let elternteil1: Elternteil = { months: emptyMonths };
  let elternteil2: Elternteil = elternteil1;

  if (settings && hasMutterschutzSettings(settings)) {
    const { elternteil, endDate } = settings.mutterschutz;
    const numberOfMutterschutzMonths = getNumberOfMutterschutzMonths(
      settings.geburtstag,
      endDate,
    );
    const months: Month[] = emptyMonths.map((month, index) => {
      if (index < numberOfMutterschutzMonths) {
        return { ...month, type: "BEG", isMutterschutzMonth: true };
      }
      return month;
    });

    switch (elternteil) {
      case "ET1":
        elternteil1 = { months };
        break;
      case "ET2":
        elternteil2 = { months };
        break;
    }
    begAnspruch -= numberOfMutterschutzMonths;
  }

  let partnerschaftsbonus = maxNumberOfPartnerschaftbonus;

  if (getPartnerMonateSettings(settings)) {
    begAnspruch = begAnspruch + 2;
  } else {
    partnerschaftsbonus = 0;
  }

  return {
    remainingMonths: {
      basiselterngeld: begAnspruch,
      elterngeldplus: begAnspruch * 2,
      partnerschaftsbonus,
    },
    ET1: elternteil1,
    ET2: elternteil2,
  };
};
