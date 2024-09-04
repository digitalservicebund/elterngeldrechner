import gridClassNames from "./grid.module.css";
import { Elternteil } from "@/features/planer/domain";

export const GRID_TEMPLATE_CLASS_NAMES: {
  [numberOfElternteile: number]: string;
} = {
  1: gridClassNames.gridTemplateForSingleElternteil,
  2: gridClassNames.gridTemplateForTwoElternteile,
};

export const PlACE_ITEM_MIDDLE_CLASS_NAME = gridClassNames.placeItemMiddle;

export const PLACE_ITEM_FULL_WIDTH_CLASS_NAME =
  gridClassNames.placeItemFullWitdh;

export const PLACE_ITEM_CLASS_NAMES: Record<
  Elternteil,
  Record<AreaName, string>
> = {
  [Elternteil.Eins]: {
    outside: gridClassNames.placeItemEt1Outside,
    inside: gridClassNames.placeItemEt1Inside,
    full: gridClassNames.placeItemEt1Full,
  },
  [Elternteil.Zwei]: {
    outside: gridClassNames.placeItemEt2Outside,
    inside: gridClassNames.placeItemEt2Inside,
    full: gridClassNames.placeItemEt2Full,
  },
};

type AreaName = "inside" | "outside" | "full";
