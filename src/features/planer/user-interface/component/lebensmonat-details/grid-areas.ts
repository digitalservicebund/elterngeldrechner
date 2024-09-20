import gridClassNames from "./grid.module.css";
import { Elternteil } from "@/features/planer/domain";

export const GridTemplates: {
  [numberOfElternteile: number]: string;
} = {
  1: gridClassNames.gridTemplateForSingleElternteil,
  2: gridClassNames.gridTemplateForTwoElternteile,
};

export const GridAreasForSummary = {
  middle: gridClassNames.placeItemMiddle,
  [Elternteil.Eins]: {
    elterngeldbezug: gridClassNames.placeItemEt1Outside,
    gewaehlteOption: gridClassNames.placeItemEt1Inside,
  },
  [Elternteil.Zwei]: {
    elterngeldbezug: gridClassNames.placeItemEt2Outside,
    gewaehlteOption: gridClassNames.placeItemEt2Inside,
  },
};

export const GridAreasForContent = {
  fullWidth: gridClassNames.placeItemFullWitdh,
  [Elternteil.Eins]: {
    auswahl: gridClassNames.placeItemEt1Full,
  },
  [Elternteil.Zwei]: {
    auswahl: gridClassNames.placeItemEt2Full,
  },
};
