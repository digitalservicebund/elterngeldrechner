import { VFC } from "react";

interface Props {
  elternteilName: string;
}

export const NotificationBEGResultWasRecalculated: VFC<Props> = ({
  elternteilName,
}) => {
  return (
    <div>
      Das Ergebnis der Berechnung für {elternteilName} hat sich verändert, da
      Sie Angaben im Formular geändert haben.
    </div>
  );
};
