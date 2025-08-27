import {
  getRecordEntriesWithIntegerKeys,
  getRecordEntriesWithStringKeys,
} from "./get-entries";

/**
 * Adds the missing function of `Object.prototype` to map values like entries
 * for `Array.prototype`. It applies a transform callback to each value of the
 * given record. Therefore it uses the {@link getRecordEntriesWithStringKeys} to
 * do this in a type safe manner for `Record`s. See the linked documentation for
 * further details.
 */
export function mapRecordEntriesWithStringKeys<
  Key extends string,
  SourceValue,
  TargetValue,
>(
  record: Partial<Record<Key, SourceValue>>,
  keyTypeGuard: (key: unknown) => key is Key,
  transform: (value: SourceValue, key: Key) => TargetValue,
): Record<Key, TargetValue> {
  const sourceEntries = getRecordEntriesWithStringKeys(record, keyTypeGuard);

  return Object.fromEntries(
    sourceEntries.map(([key, value]) => [key, transform(value, key)]),
  ) as Record<Key, TargetValue>;
}

/**
 * Complementary version of {@link mapRecordEntriesWithStringKeys} for `Record`s
 * types that use an integer type for its keys. Also refer to the related {@link
 * getRecordEntriesWithIntegerKeys} for further details.
 */
export function mapRecordEntriesWithIntegerKeys<
  Key extends number,
  SourceValue,
  TargetValue,
>(
  record: Partial<Record<Key, SourceValue>>,
  keyTypeGuard: (key: unknown) => key is Key,
  transform: (value: SourceValue, key: Key) => TargetValue,
): Record<Key, TargetValue> {
  const sourceEntries = getRecordEntriesWithIntegerKeys(record, keyTypeGuard);

  return Object.fromEntries(
    sourceEntries.map(([key, value]) => [key, transform(value, key)]),
  ) as Record<Key, TargetValue>;
}
