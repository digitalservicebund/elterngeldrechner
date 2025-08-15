import { BeispielAuswahloptionPlakette } from "./BeispielAuswahloptionPlakette";
import { Auswahloption, isAuswahloption } from "@/monatsplaner/Auswahloption";
import { getRecordEntriesWithStringKeys } from "@/monatsplaner/common/type-safe-records";

type Props = {
  readonly monatsverteilung: Partial<Record<Auswahloption, number>>;
};

export function BeispielMonatsverteilung({ monatsverteilung }: Props) {
  const listeMonatsverteilung = getRecordEntriesWithStringKeys(
    monatsverteilung,
    isAuswahloption,
  );

  return (
    <div className="flex h-[24px]">
      {listeMonatsverteilung.map(([key, count]) => (
        <BeispielAuswahloptionPlakette
          key={key}
          auswahloption={key}
          className="text-sm flex items-center justify-center font-bold"
          style={{ flexGrow: count, flexBasis: 0, fontSize: 14 }}
        />
      ))}
    </div>
  );
}
