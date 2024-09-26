import gridClassNames from "./grid.module.css";
import { Elternteil } from "@/features/planer/user-interface/service";

export const GRID_LAYOUT_TEMPLATES: {
  [numberOfElternteile: number]: string;
} = {
  1: gridClassNames.gridTemplateForSingleElternteil,
  2: gridClassNames.gridTemplateForTwoElternteile,
};

export const GRID_LAYOUT_KOPFLEISTE_AREA_CLASS_NAMES = {
  [Elternteil.Eins]: { pseudonym: gridClassNames.areaKopfleisteEt1Pseudonym },
  [Elternteil.Zwei]: { pseudonym: gridClassNames.areaKopfleisteEt2Pseudonym },
};

export const GRID_LAYOUT_SUMMARY_AREA_CLASS_NAMES = {
  lebensmonatszahl: gridClassNames.areaSummaryLebensmonatszahl,
  [Elternteil.Eins]: {
    elterngeldbezug: gridClassNames.areaSummaryEt1Elterngeldbezug,
    gewaehlteOption: gridClassNames.areaSummaryEt1GewaehlteOption,
  },
  [Elternteil.Zwei]: {
    elterngeldbezug: gridClassNames.areaSummaryEt2Elterngeldbezug,
    gewaehlteOption: gridClassNames.areaSummaryEt2GewaehlteOption,
  },
};

export const GRID_LAYOUT_CONTENT_AREA_CLASS_NAMES = {
  description: gridClassNames.areaContentDescription,
  hinweisZumBonus: gridClassNames.areaContentHinweisZumBonus,
  [Elternteil.Eins]: {
    auswahl: {
      fieldset: gridClassNames.areaContentEt1AuswahlFieldset,
      info: gridClassNames.areaContentEt1AuswahlInfo,
      input: gridClassNames.areaContentEt1AuswahlInput,
    },
  },
  [Elternteil.Zwei]: {
    auswahl: {
      fieldset: gridClassNames.areaContentEt2AuswahlFieldset,
      info: gridClassNames.areaContentEt2AuswahlInfo,
      input: gridClassNames.areaContentEt2AuswahlInput,
    },
  },
};
