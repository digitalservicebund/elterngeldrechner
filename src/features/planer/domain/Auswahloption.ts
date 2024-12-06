import { isVariante, Variante } from "./Variante";

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
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
export const KeinElterngeld = "kein Elterngeld" as const;

export const Auswahloptionen = [KeinElterngeld, ...Object.values(Variante)] as (
  | Variante
  | typeof KeinElterngeld
)[];

export type Auswahloption = (typeof Auswahloptionen)[number];

export function isAuswahloption(value: unknown): value is Auswahloption {
  return isVariante(value) || value === KeinElterngeld;
}

if (import.meta.vitest) {
  const { test, expect } = import.meta.vitest;

  test.each(Auswahloptionen)("type guard is satisfied by %s", (value) => {
    expect(isAuswahloption(value)).toBe(true);
  });

  test.each(["None", "Basis", "Elterngeld", "nichts"])(
    "type guard is unsatisfied by %s",
    (value) => {
      expect(isAuswahloption(value)).toBe(false);
    },
  );
}
