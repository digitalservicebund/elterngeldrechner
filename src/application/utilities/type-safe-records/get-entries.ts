/**
 * Type safe version of `Object.entries` for `Record` types that use a string
 * type for its keys.
 *
 * Resolved issues based on how objects work in JavaScript and that TypeScript
 * records become unsafe when used with with `Object.prototype` methods. While
 * TypeScript ensures that a piece of code can only access the properties of
 * an object known by the record key type definition, this is disregarded in other
 * cases. Should mean `Object.entries` can return more entries than expected for
 * keys which are not of the declared record key type.
 *
 * This implementation ensures that only entries with correct keys according to
 * the record definition are returned. Furthermore it adds some type-casting to
 * tell TypeScript about this on the caller side.
 */
export function getRecordEntriesWithStringKeys<Key extends string, Value>(
  record: Partial<Record<Key, Value>>,
  keyTypeGuard: (key: unknown) => key is Key,
): [Key, Value][] {
  return Object.entries(record).filter(
    ([key]) => Object.hasOwn(record, key) && keyTypeGuard(key),
  ) as [Key, Value][];
}

/**
 * Type safe version of `Object.entries` for `Record` types that use a integer
 * type for its keys.
 *
 * See {@link getRecordEntriesWithStringKeys} for further details of the
 * origin problem solved here.
 *
 * This is an extension of {@link getRecordEntriesWithStringKeys} with the
 * addition thatJ the returned key values are actually integers (not just force
 * type-cast). Because JavaScript converts any number key of an object into
 * a string, `Object.entries` also returns plain strings for each entry.
 *
 * Notice that it is the callers responsibility to ensure the keys are actual
 * integers. While the type-system of TypeScript only knows numbers, the parsing
 * of strings to numbers differs between integers and floats.
 */
export function getRecordEntriesWithIntegerKeys<Key extends number, Value>(
  record: Partial<Record<Key, Value>>,
  keyTypeGuard: (key: unknown) => key is Key,
): [Key, Value][] {
  return Object.entries(record)
    .map(([key, value]) => [Number.parseInt(key), value])
    .filter(
      ([key]) => Object.hasOwn(record, key as number) && keyTypeGuard(key),
    ) as [Key, Value][];
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest;

  it("uses the key type guard to filter entries", () => {
    type Two = "two";
    const isTwo = (value: unknown): value is Two => value === "two";

    const entries = getRecordEntriesWithStringKeys(
      { two: true, 2: true, three: true } as Record<Two, boolean>,
      isTwo,
    );

    expect(entries).toHaveLength(1);
    expect(entries).toStrictEqual([["two", true]]);
  });

  it("converts original integers keys back to integers", () => {
    const entries = getRecordEntriesWithIntegerKeys(
      { 1: true, 2: true },
      (value: unknown): value is number => typeof value === "number",
    );

    expect(entries).toHaveLength(2);
    expect(entries).toStrictEqual([
      [1, true],
      [2, true],
    ]);
  });
}
