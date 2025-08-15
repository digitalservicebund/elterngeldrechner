import { BeispielVariantenplakette } from "./BeispielVariantenplakette";
import {
  type BeispielVariante,
  isBeispielVariante,
} from "@/application/features/beispiele/types";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly monatsverteilung: Partial<Record<BeispielVariante, number>>;
};

export function BeispielMonatsverteilung({ monatsverteilung }: Props) {
  const records = getRecordEntriesWithStringKeys(
    monatsverteilung,
    isBeispielVariante,
  );

  return (
    <div className="flex h-[24px]">
      {records.map(([key, count]) => (
        <BeispielVariantenplakette
          key={key}
          variante={key}
          className="text-sm flex items-center justify-center font-bold"
          style={{ flexGrow: count, flexBasis: 0, fontSize: 14 }}
        />
      ))}
    </div>
  );
}
