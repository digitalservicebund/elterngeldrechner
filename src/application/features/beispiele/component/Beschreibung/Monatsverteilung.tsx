import { AuswahloptionPlakette } from "@/application/features/beispiele/component/Erklaerung/AuswahloptionPlakette";
import { Auswahloption, isAuswahloption } from "@/monatsplaner/Auswahloption";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly monatsverteilung: Partial<Record<Auswahloption, number>>;
};

export function Monatsverteilung({ monatsverteilung }: Props) {
  const listeMonatsverteilung = getRecordEntriesWithStringKeys(
    monatsverteilung,
    isAuswahloption,
  );

  return (
    <div className="flex h-[24px]">
      {listeMonatsverteilung.map(([key, count]) => (
        <AuswahloptionPlakette
          key={key}
          auswahloption={key}
          className="text-sm flex items-center justify-center font-bold"
          style={{ flexGrow: count, flexBasis: 0, fontSize: 14 }}
        />
      ))}
    </div>
  );
}
