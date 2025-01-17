import { BruttoEinkommen } from "./einkommen-types";

/**
 * Erwerbszeitraum für Einkommen NACH der Geburt.
 */
export type ErwerbsZeitraumLebensMonat = Readonly<{
  vonLebensMonat: number;
  bisLebensMonat: number;
  bruttoProMonat: BruttoEinkommen;
}>;
