import { Einkommen } from "./einkommen";

/**
 * Erwerbszeitraum für Einkommen NACH der Geburt.
 */
export type ErwerbsZeitraumLebensMonat = Readonly<{
  vonLebensMonat: number;
  bisLebensMonat: number;
  bruttoProMonat: Einkommen;
}>;
