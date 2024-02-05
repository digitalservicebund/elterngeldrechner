import { DateTime } from "luxon";
import { Geburtstag } from "./elternteile-types";

export type Fruehchen = "16Weeks" | "12Weeks" | "8Weeks" | "6Weeks";

export const getFruehchen = (geburtstag: Geburtstag): Fruehchen | "NotAFruehchen" => {
  const weeks = DateTime.fromISO(geburtstag.errechnet).diff(DateTime.fromISO(geburtstag.geburt)).as("weeks");
  if (weeks >= 16) {
    return "16Weeks";
  }
  if (weeks >= 12) {
    return "12Weeks";
  }
  if (weeks >= 8) {
    return "8Weeks";
  }
  if (weeks >= 6) {
    return "6Weeks";
  }
  return "NotAFruehchen";
};
