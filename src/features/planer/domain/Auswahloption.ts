import { Variante } from "./Variante";

/*
 * Represents the option to take no of the above Varianten. Besides other
 * technical advantages, this is a expressive replacement for a `null` value.
 * This is especially helpful because `null` can not be used to as key for
 * objects.
 *
 * An implementation of a `unique symbol` would have similar benefits like an
 * enumeration for a single value in terms of refactoring. But `Symbol`s can not
 * be iterated in TypeScript.
 */
export const KeinElterngeld = "kein Elterngeld" as const;

export type Auswahloption = Variante | typeof KeinElterngeld;
