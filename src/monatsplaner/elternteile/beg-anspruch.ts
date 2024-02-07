import { Geburtstag } from "./elternteile-types";
import { getFruehchen } from "./fruehchen";

export const getBEGAnspruch = (geburtstag?: Geburtstag): number => {
  if (!geburtstag) {
    return 12;
  }
  switch (getFruehchen(geburtstag)) {
    case "16Weeks":
      return 16;
    case "12Weeks":
      return 15;
    case "8Weeks":
      return 14;
    case "6Weeks":
      return 13;
    case "NotAFruehchen":
      return 12;
  }
};
