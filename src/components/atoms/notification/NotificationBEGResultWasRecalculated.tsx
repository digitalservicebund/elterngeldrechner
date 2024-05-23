import { YesNo } from "@/globals/js/calculations/model";

interface Props {
  elternteilName: string;
  alleinerziehend?: YesNo | null;
}

export function NotificationBEGResultWasRecalculated({
  elternteilName,
  alleinerziehend,
}: Props) {
  return (
    <div>
      {alleinerziehend !== YesNo.YES
        ? `Das Ergebnis der Berechnung für ${elternteilName} hat sich verändert, da Sie Angaben im Formular geändert haben.`
        : "Das Ergebnis der Berechnung hat sich verändert, da Sie Angaben im Formular geändert haben."}
    </div>
  );
}
