import { BruttoEinkommen } from "./einkommen-types";

/**
 * Erwerbszeitraum für Einkommen NACH der Geburt.
 */
export class ErwerbsZeitraumLebensMonat {
  constructor(
    public vonLebensMonat: number,
    public bisLebensMonat: number,
    public bruttoProMonat: BruttoEinkommen,
  ) {}
}
