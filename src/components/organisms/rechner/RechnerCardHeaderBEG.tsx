import { VFC } from "react";
import nsp from "../../../globals/js/namespace";
import { InfoDialog, infoTexts } from "../../molecules/info-dialog";

export const RechnerCardHeaderBEG: VFC = () => {
  return (
    <div className={nsp("rechner-card__header")}>
      <div className={nsp("rechner-card-title")}>
        <div className={nsp("rechner-card-title__text")}>
          <h2>Basiselterngeld</h2>
          <span>(14 Monate verfügbar)</span>
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
          <li>Monate können untereinander aufgeteilt werden</li>
          <li>Alleinerziehende können die Partnermonate auch bekommen</li>
          <li>
            Die Elternteile können maximal für einen Monat in den ersten zwölf
            Lebensmonaten ihres Kindes gleichzeitig Basiselterngeld bekommen.
            Eltern von Frühchen, Mehrlingen, Neugeborenen mit Behinderung und
            Geschwisterkindern mit Behinderung können uneingeschränkt
            gleichzeitig Elterngeld beziehen.
          </li>
        </ol>
      </div>
    </div>
  );
};
