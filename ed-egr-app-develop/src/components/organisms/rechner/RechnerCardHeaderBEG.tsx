import { VFC } from "react";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

export const RechnerCardHeaderBEG: VFC = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>Basiselterngeld</h2>
          <p>(14 Monate verfügbar)</p>
        </div>
        <InfoDialog isLarge={true} info={infoTexts.monatsplannerBasis} />
      </div>
      <div className={nsp("rechner-card__description")}>
        <ol>
          <li>Für bis zu 12 Lebensmonate Ihres Kindes</li>
          <li>
            2 zusätzliche Monate, wenn beide Elternteile Elterngeld beantragen
            und mindestens ein Elternteil nach der Geburt weniger Einkommen hat
            (Partnermonate)
          </li>
          <li>
            Monate können nach den Wünschen der Eltern untereinander aufgeteilt
            werden
          </li>
          <li>Alleinerziehende können die Partnermonate auch bekommen</li>
        </ol>
      </div>
    </div>
  );
};
